import * as express from 'express';
import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import * as cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// user: files

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

	if (await db.listCollections({ name: 'query' }).hasNext()) {
		db.collection('query').drop(function(err, delOK) {
			if (err) throw err;
			if (delOK) console.log("Collection deleted");
		});
		console.log('Collection deleted.');
	}

	if (await db.listCollections({ name: 'query' }).hasNext()) {
		console.log('Collection already exists. Skipping initialization.');
		return;
	}

	const query = db.collection('query');
	const result = await query.insertMany([
		{ 'a': []},
		{ 'b': []},
		{ 'c': []},
	]);

	console.log(`Initialized ${result.insertedCount} query`);
	console.log(`Initialized:`);

	for (let key in result.insertedIds) {
		console.log(`  Inserted user with ID ${result.insertedIds[key]}`);
	}
}

async function getUsers(mongo: MongoClient) {
	const query = mongo.db().collection('query');
	const result = query.find();

	const ret = Object.getOwnPropertyNames(result);
	return ret;
}

async function checkUsers(mongo: MongoClient, uId: string) {
	const query = mongo.db().collection('query');
	const result = query.find();

	return uId in result;
}

async function addUser(mongo: MongoClient, uId: string) {
	const query = mongo.db().collection('query');
	query.insertOne({[uId]: []});
	return;
}

async function removeUser(mongo: MongoClient, uId: string) {
	const query = mongo.db().collection('query');
	return query.updateOne({}, {$unset: { [uId]: ""}});
}

async function getFiles(mongo: MongoClient, uId: string) {
	const query = mongo.db().collection('query');
	return query.findOne()[uId];
}

async function addFile(mongo: MongoClient, uId: string, fileId: string) {
	const query = mongo.db().collection('query');
	return query.updateOne({}, {$push: { [uId]: fileId}});
}

async function removeFile(mongo: MongoClient, uId: string, fileId: string) {
	const query = mongo.db().collection('query');
	return query.updateOne({}, {$pull: { [uId]: fileId}});
}

async function start() {
	const mongo = await connectDB();
	await initDB(mongo);

	app.get('/users/list', async (req: Request, res: Response) => {
		try {
			res.status(200).send({
				"files": await getUsers(mongo)
			});
		} catch (e) {
			res.status(500).send(e);
		}
	});

	app.get('/users/find', async (req: Request, res: Response) => {
		try {
			const { uId }: { uId: string } = req.body;
			res.status(200).send({
				'status': await checkUsers(mongo, uId)
			});
		} catch (e) {
			res.status(500).send(e);
		}
	});

	app.get('/user/:uId/files', async (req: Request, res: Response) => {
		try {
			const uId = req.params.uId;
			const ret = await getFiles(mongo, uId);
			res.status(201).json(ret);
		} catch (e) {
			res.status(500).send(e);
		}
	});

	app.post('/events', async (req: Request, res: Response) => {
		const {type, data} = req.body;
		if (type === 'AccountCreated') {
			const { uId }: { uId: string } = data;
			await addUser(mongo, uId);
			res.status(201).json(uId);
		} else if (type === 'AccountDeleted') {
			const { uId }: { uId: string } = data;
			const ret = await removeUser(mongo, uId);
			res.status(201).json(ret);
		} else if (type === 'FileCreated') {
			const { uId, fileId }: { uId: string, fileId: string } = data;
			const ret = await addFile(mongo, uId, fileId);
			res.status(201).json(ret);
		} else if (type === 'FileDeleted') {
			const { uId, fileId }: { uId: string, fileId: string } = data;
			const ret = await removeFile(mongo, uId, fileId);
			res.status(201).json(ret);
		}
	});
	app.listen(4007, () => {
		console.log('Listening on 4007');
	});
}

start();