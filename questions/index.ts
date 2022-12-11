import * as express from 'express';
import { Request, Response } from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import { verify } from 'crypto';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// uid : security question
interface database {
	[key: string]: string
};

async function connectDB(): Promise<MongoClient>{
	const uri = process.env.DATABASE_URL;

	if (uri === undefined) {
			throw Error('DATABASE_URL environment variable is not specified');
	}
	
	const mongo = new MongoClient(uri);
	await mongo.connect();
	return await Promise.resolve(mongo);
}

async function initDB(mongo: MongoClient) {
	const db = mongo.db();

	if (await db.listCollections({ name: 'questions' }).hasNext()) {
		db.collection('questions').drop(function(err, delOK) {
			if (err) throw err;
			if (delOK) console.log("Collection deleted");
		});
		console.log('Collection deleted.');
	}

	if (await db.listCollections({ name: 'questions' }).hasNext()) {
		console.log('Collection already exists. Skipping initialization.');
		return;
	}

	const questions = db.collection('questions');
	const result = await questions.insertMany([
		{ 'a': 'test'},
		{ 'b': 'test'},
		{ 'c': 'test'},
	]);

	console.log(`Initialized ${result.insertedCount} questions`);
	console.log(`Initialized:`);

	for (let key in result.insertedIds) {
		console.log(`  Inserted user with ID ${result.insertedIds[key]}`);
	}
}

async function verify(mongo: MongoClient, uid: string, question: string) {
	const questions = mongo.db().collection('questions');
	const ret = questions.find({$and: 
		[{uid: uid},
		{question: question}]
	});
	return ret.toArray();
}

async function reset(mongo: MongoClient) {
	const questions = mongo.db().collection('questions');
	return questions.deleteMany({});
}

async function insertQuestion(mongo: MongoClient, uid: string, question: string) {
	const questions = mongo.db().collection('questions');
	return questions.insertOne({uid, question});
}


async function start() {
	const mongo = await connectDB();
	await initDB(mongo);
	
	// will be used for checking and returning
	app.get('/verify', async (req: Request, res: Response) => {
		try {
			if ( Object.keys(req.body).length !== 3 ){
				res.status(400).send({ message: 'BAD REQUEST' });
			} else {
				const { uid, question, otp} = req.body;

				const ret = await verify(mongo, uid, question);
				if (ret.length > 0) {
					axios.post('http://event-bus:4005/events', {
						type: 'ChangePassword',
						data: {
							uid,
							otp
						}
					});
					res.status(201).send(ret);
				} else {
					res.status(404).send({ message: 'NOT FOUND'});
				}
			}
		} catch (e) {
			res.status(500).send(e);
		}
	});	

	app.post('/new/user', async (req: Request, res: Response) => {
		try {
			if ( Object.keys(req.body).length !== 2 ){
				res.status(400).send({ message: 'BAD REQUEST' });
			} else {
				const { uid, question } = req.body;
				const ret = await insertQuestion(mongo, uid, question);
				if (ret.acknowledged) {
					res.status(201).send(ret);
				} else {
					res.status(400).send(ret);
				}
			}
		} catch (e) {
			res.status(500).send(e);
		}
	});

	app.delete('/reset', async (req: Request, res: Response) => {
		try {
			const ret = await reset(mongo);
			res.status(201).send(ret);
		} catch (e) {
			res.status(500).send(e);
		}
	});


	app.post('/events', (req: Request, res: Response) => {
		const {type, data }: {type: string, data: { uid: string, email?: string }} = req.body;
		if (type === 'AccountCreated') {
			const { uid , email }: { uid: string, email?: string } = data;
			db[uid] = email!;
		} else if (type === 'AccountDeleted') {
			const { uid }: { uid: string, email?: string } = data;
			delete db[uid];
		}
		res.send({status: 'ok'});
	});
}

start();


app.listen(4006, () => {
	console.log('Listening on 4006');
});