import * as express from 'express';
import axios from 'axios';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { stringDistance } from './utils.js';
import { File } from './interfaces.js';

async function connectDB() {
	const uri = process.env.DATABASE_URL;
	if (uri === undefined) {
		throw Error('DATABASE_URL environment variable is not specified');
	}
	const mongo = new MongoClient(uri);
	await mongo.connect();
	return await Promise.resolve(mongo);
}

async function initBlacklistDB(mongo) {
	const db = mongo.db();
	const blacklist = db.collection('blacklist');
	await blacklist.insertOne({ key: 'blacklist', blacklist: ['fork', 'raptor', 'java', 'jrk', 'mcboatface'] });
	return blacklist;
}

async function initBadfilesDB(mongo) {
	const db = mongo.db();
	const badfiles = db.collection('badfiles');
	return badfiles;
}

async function getBlacklist(blacklistDB) {
	const blacklistObj = await blacklistDB.findOne({ key: 'blacklist' });
	return blacklistObj.blacklist || [];
}

async function getBadfiles(badfilesDB) {
	const badfilesObj = await badfilesDB.find();
	const badfiles: { fileId: string, content: string }[] = [];
	await badfilesObj.forEach(doc => {
		badfiles.push({ fileId: doc.fileId, content: doc.content }); 
	});
    return badfiles;
}

const app = express();

async function start() {

	const mongo = await connectDB();
	
    const blacklistDB = await initBlacklistDB(mongo);
	const badfilesDB = await initBadfilesDB(mongo);
    const blacklist = await getBlacklist(blacklistDB); // in memory at start of service
	
    app.use(express.json());
	app.use(cors());

	app.post('/events', async (req, res) => {
		const { type, data }: { type: string; data: { file: File } } = req.body;
		const file: File = data.file;
		if (type === 'FileModified') {
            const badfile = await badfilesDB.findOne({ fileId: file.fileId });
			for (let fword of file.content.split(/[^a-zA-Z\d]/)) {
				// split file string by punctuation or whitespace
				for (const bword of blacklist) {
					if (stringDistance(fword, bword) / ((fword.length + bword.length) >> 1) <= 0.2) {
                        if (badfile) {
                            await badfilesDB.updateOne({ fileId: file.fileId }, { content: file.content });
                        } else {
                            await badfilesDB.insertOne({ fileId: file.fileId, content: file.content });
                        }
						break;
					}
				}
			}
		} else if (type === 'ShootWordAnalytics') {
            const badfiles = await getBadfiles(badfilesDB);
			axios.post('http://event-bus:4005/events', {
				type: 'GetWordAnalytics',
				data: {
					files: badfiles
				}
			});
		}
		res.send({});
	});

	app.listen(4005, () => {
		console.log('Listening on 4005');
	});
}

start();