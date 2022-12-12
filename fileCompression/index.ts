import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import { MongoClient } from 'mongodb';
import { encode, decode } from 'lossless-text-compression';
import * as JSZip from 'jszip';
import * as fs from 'fs';

const app = express();

app.use(express.json());
app.use(cors());

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

	if (await db.listCollections({ name: 'filecompression' }).hasNext()) {
		db.collection('filecompression').drop(function(err, delOK) {
			if (err) throw err;
			if (delOK) console.log("Collection deleted");
		});
		console.log('Collection deleted.');
	}

	if (await db.listCollections({ name: 'filecompression' }).hasNext()) {
		console.log('Collection already exists. Skipping initialization.');
		return;
	}

	const query = db.collection('filecompression');
	const result = await query.insertMany([
		{ fileId: 'a', content: 'testtext'},
		{ fileId: 'b', content: 'testtext'},
		{ fileId: 'c', content: 'testtext'}
	]);

	console.log(`Initialized ${result.insertedCount} query`);
	console.log(`Initialized:`);

	for (let key in result.insertedIds) {
		console.log(`  Inserted user with ID ${result.insertedIds[key]}`);
	}
}

//db crud operations
async function insertFile(mongo: MongoClient, fileId: string, content: string) {
	const fc = mongo.db().collection('filecompression');
	return fc.insertOne({fileId, content});
}

async function getFile(mongo: MongoClient, fileId: string) {
	const fc = mongo.db().collection('filecompression');
	return fc.findOne({fileId});
}

async function deleteFile(mongo: MongoClient, fileId: string, content: string) {
	const fc = mongo.db().collection('filecompression');
	return fc.deleteOne({fileId, content});
}

async function modifyFile(mongo: MongoClient, fileId: string, content: string) {
	const fc = mongo.db().collection('filecompression');
	return fc.updateOne({fileId}, {$set: {content}});
}

async function start() {
	const mongo = await connectDB();
	await initDB(mongo);

	app.get('/user/file/zip', async (req: Request, res: Response) => {
		const { fileId }: { fileId: string } = req.body;
		try {
			const ret = await getFile(mongo, fileId);
			if (ret) {
				var zip = new JSZip();
				zip.file(`${fileId}`, ret.content);
				zip
				.generateNodeStream({type:'nodebuffer',streamFiles:true})
				.pipe(fs.createWriteStream('out.zip'))
				.on('finish', function () {
						// JSZip generates a readable stream with a "end" event,
						// but is piped here in a writable stream which emits a "finish" event.
						console.log("out.zip written.");
				});
				res.status(200).send(ret.content);
			} else {
				res.status(400).json({message: 'NOT FOUND'});
			}
		} catch (e) {
			res.status(500).send(e);
		}
	});
	
	app.post('/events', async (req: Request, res: Response) => {
		const {type, data}: {type: string, data: { fileId: string, content?: string }} = req.body;
		if (type === 'FileOpened') {
			try {
				const { fileId }: { fileId: string } = data;
				const ret = await getFile(mongo, fileId);
				if (ret) {
					res.status(200).send(ret.content);
				} else {
					res.status(400).json({message: 'NOT FOUND'});
				}
			} catch (e) {
				res.status(500).send(e);
			}
		} else if (type === 'FileModified') {
			try {
				const { fileId, content } = data;
				const ret = await modifyFile(mongo, fileId, content);
				if (ret.acknowledged) {
					res.status(201).send(ret);
				} else {
					res.status(400).send(ret);
				}
			} catch (e) {
				res.status(500).send(e);
			}
		} else if (type === 'FileDeleted') {
			try {
				const { fileId, content } = data;
				const ret = await deleteFile(mongo, fileId, content);
				if (ret.acknowledged) {
					res.status(201).send(ret);
				} else {
					res.status(400).send(ret);
				}
			} catch (e) {
				res.send(500).send(e)
			}
		} else if (type === 'FileCreated') {
			try {
				const { fileId, content } = data;
				const ret = await insertFile(mongo, fileId, content);
				if (ret.acknowledged) {
					res.status(201).send(ret);
				} else {
					res.status(400).send(ret);
				}
			} catch (e) {
				res.send(500).send(e)
			}
		}
	});
	
	app.listen(4008, () => {
		console.log('Listening on 4008');
	});
}

start();