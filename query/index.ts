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

async function initAuthDB(mongo) {
	try {
		const auth = mongo.db().collection('auth');
		return auth;
	} catch (e) {
		console.log(e);
		return null;
	}
}

async function getUsers(mongo: MongoClient) {
	const query = mongo.db().collection('query');
	const result = query.find();

	const ret = Object.getOwnPropertyNames(result);
	return ret;
}

async function checkUsers(mongo: MongoClient, uid: string) {
	const query = mongo.db().collection('query');
	const result = query.find();

	return uid in result;
}

async function addUser(mongo: MongoClient, uid: string) {
	const query = mongo.db().collection('query');
	query.insertOne({[uid]: []});
	return;
}

async function removeUser(mongo: MongoClient, uid: string) {
	const query = mongo.db().collection('query');
	return query.updateOne({}, {$unset: { [uid]: ""}});
}

async function getFiles(mongo: MongoClient, uid: string) {
	const query = mongo.db().collection('query');
	return query.findOne()[uid];
}

async function addFile(mongo: MongoClient, uid: string, fileId: string) {
	const query = mongo.db().collection('query');
	return query.updateOne({}, {$push: { [uid]: fileId}});
}

async function removeFile(mongo: MongoClient, uid: string, fileId: string) {
	const query = mongo.db().collection('query');
	return query.updateOne({}, {$pull: { [uid]: fileId}});
}

async function start() {
	const mongo = await connectDB();
	await initDB(mongo);
	const authDB = await initAuthDB(mongo);

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
		const { uid, accessToken }: { uid: string, accessToken: string } = req.body;
		try {
			if (!uid || !accessToken) res.status(400).send('Missing Information');
			const user = await authDB.findOne({ uid });
			if (user === null) res.status(400).send('User Does Not Exist');
			else if (accessToken !== user.accessToken /* || !user.admin */) res.status(400).send('Unauthorized Access');
		} catch(e) {
			console.log(e);
		}
		try {
			res.status(200).send({
				'status': await checkUsers(mongo, uid)
			});
		} catch (e) {
			res.status(500).send(e);
		}
	});

	app.get('/user/:uid/files', async (req: Request, res: Response) => {
		const { uid, accessToken }: { uid: string, accessToken: string } = req.body;
		try {
			if (!uid || !accessToken) res.status(400).send('Missing Information');
			const user = await authDB.findOne({ uid });
			if (user === null) res.status(400).send('User Does Not Exist');
			else if (accessToken !== user.accessToken /* || !user.admin */) res.status(400).send('Unauthorized Access');
		} catch(e) {
			console.log(e);
		}
		try {
			const ret = await getFiles(mongo, uid);
			res.status(201).json(ret);
		} catch (e) {
			res.status(500).send(e);
		}
	});

	app.post('/events', async (req: Request, res: Response) => {
		const {type, data} = req.body;
		if (type === 'AccountCreated') {
			const { uid, accessToken, admin }: { uid: string, accessToken: string, admin: boolean} = data;
			await authDB.insertOne({ uid, accessToken, admin });
			await addUser(mongo, uid);
			res.status(201).json(uid);
		} else if (type === 'AccountDeleted') {
			const { uid }: { uid: string } = data;
			const ret = await removeUser(mongo, uid);
			res.status(201).json(ret);
		} else if (type === 'FileCreated') {
			const { uid, fileId }: { uid: string, fileId: string } = data;
			const ret = await addFile(mongo, uid, fileId);
			res.status(201).json(ret);
		} else if (type === 'FileDeleted') {
			const { uid, fileId }: { uid: string, fileId: string } = data;
			const ret = await removeFile(mongo, uid, fileId);
			res.status(201).json(ret);
		}
	});
	app.listen(4007, () => {
		console.log('Listening on 4007');
	});
}

start();