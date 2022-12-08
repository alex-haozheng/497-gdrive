import * as express from 'express';
import * as cors from 'cors';
import axios from 'axios';
const app = express();
import { Analytics, File } from './interfaces.js';
import { isAdmin, processFiles, condense } from './utils.js';
import { MongoClient } from 'mongodb';

//! questions about design, global database

app.use(express.json());
app.use(cors());

let files: File[] = [];
let badfiles: File[] = [];

async function connectDB(): Promise<MongoClient> {
	const uri = process.env.DATABASE_URL;
	if (uri === undefined) {
		throw Error('DATABASE_URL environment variable is not specified');
	}
	const mongo = new MongoClient(uri);
	await mongo.connect();
	return await Promise.resolve(mongo);
}

async function initDB(mongo: MongoClient) {
	const analytics = mongo.db().collection('analytics');
	await analytics.insertOne({
		key: 'analytics', numFiles: 0, readability: {}, badfiles: []
	});
	return analytics;
}

async function start() {
	const mongo = await connectDB();
	let analytics = await initDB(mongo);

	setInterval(async () => {
		Promise.all([
			axios.post('http://event-bus:4012/events', {
				type: 'ShootFileAnalytics'
			}),
			axios.post('http://event-bus:4012/events', {
				type: 'ShootWordAnalytics'
			})
		]);

		analytics = mongo.db().collection('analytics');

		setTimeout(async () => {
			const indexes: number[] = processFiles(files);
			analytics.updateOne(
				{ key: 'analytics' },
				{
					$set: {
						numFiles: files.length,
						readability: condense(indexes),
						badfiles: badfiles
					}
				}
			);
		}, 1000 * 60); // wait for ShootAnalytics events to get to other services, and for GetAnalytics events to come in. No rush, we'll wait one minute. This is a completely backend async service, not worried about responding to client quickly.
	}, 1000 * 60 * 60 * 24); // night job. Run once every 24 hours for data analytics to be presented to admin. 

	app.get('/analytics', isAdmin, (req, res) => {
		res.send(analytics.findOne({ key: 'analytics' }));
	});

	app.post('/events', (req, res) => {
		if (req.body.type === 'GetWordAnalytics') {
			badfiles = req.body.data.files;
		} else if (req.body.type === 'GetFileAnalytics') {
			files = req.body.data.files;
		}
	});

	app.listen(4004, () => {
		console.log('Running on 4004');
	});
}

start();
