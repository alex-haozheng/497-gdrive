import * as express from 'express';
import * as cors from 'cors';
import axios from 'axios';
const app = express();
import { Analytics, File } from './interfaces.js';
import { isAdmin, processFiles, condense } from './utils.js';
import { MongoClient } from 'mongodb';

// TODO questions:
//! questions about design, global database
// how to look inside database inside container
// composable docker compose files?
// also tell justin to trim down the file service. Too many attributes too ambitious too little time

app.use(express.json());
app.use(cors());

let files: File[] = [];
let badfiles: File[] = [];

async function connectDB() {
	try {
		const uri = process.env.DATABASE_URL;
		if (uri === undefined) {
			throw Error('DATABASE_URL environment variable is not specified');
		}
		const mongo = new MongoClient(uri);
		await mongo.connect();
		return await Promise.resolve(mongo);
	} catch (e) {
		console.log(e);
		return null;
	}
}

async function initDB(mongo) {
	try {
		const analytics = mongo.db().collection('analytics');
		await analytics.insertOne({
			key: 'analytics',
			numFiles: 0,
			readability: {},
			badfiles: []
		});
		return analytics;
	} catch (e) {
		console.log(e);
		return null;
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

async function start() {
	const mongo = await connectDB();
	if (mongo === null) throw Error('Database connection failed');
	let analytics = await initDB(mongo);
	if (analytics === null) throw Error('Database initialization failed');
	const authDB = await initAuthDB(mongo);

	setInterval(async () => {
		try {
			Promise.all([
				axios.post('http://event-bus:4012/events', {
					type: 'ShootFileAnalytics'
				}),
				axios.post('http://event-bus:4012/events', {
					type: 'ShootWordAnalytics'
				})
			]);
		} catch (e) {
			console.log(e);
			return;
		}

		try {
			analytics = mongo.db().collection('analytics');
		} catch (e) {
			console.log(e);
			return;
		}

		setTimeout(async () => {
			try {
				const indexes = processFiles(files);
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
			} catch (e) {
				console.log(e);
				return;
			}
		}, 1000 * 60); // wait for ShootAnalytics events to get to other services, and for GetAnalytics events to come in. No rush, we'll wait one minute. This is a completely backend async service, not worried about responding to client quickly.
	}, 1000 * 60 * 60 * 24); // night job. Run once every 24 hours for data analytics to be presented to admin.

	async function isAuth(req, res, next) {
		console.log('Checking Authorization');
		const { uid, accessToken }: { uid: string, accessToken: string } = req.body;
		try {
			if (!uid || !accessToken) {
				res.status(400).send('Missing Information');
				return;
			}
			const user = await authDB.findOne({ uid });
			if (user === null) {
				res.status(400).send('User Does Not Exist');
			} else if (accessToken !== user.accessToken /* || !user.admin */) {
				res.status(400).send('Unauthorized Access');
			} else {
				next();
			}
		} catch(e) {
			console.log('isAuth Error');
			console.log(e);
		}
	}

	// TODO: uncomment isAdmin
	app.get('/analytics', isAuth, async (req, res) => {
		console.log('Made it to analytics service!');
		try {
			const results = await analytics.findOne({ key: 'analytics' });
			res.status(200).send({ numFiles: results.numFiles, readability: results.readability, badfiles: results.badfiles });
		} catch(e) {
			console.log(e);
			res.status(500).send({});
		}
	});

	app.post('/events', (req, res) => {
		if (req.body.type === 'GetWordAnalytics') {
			badfiles = req.body.data.files;
		} else if (req.body.type === 'GetFileAnalytics') {
			files = req.body.data.files;
		} else if (req.body.type === 'AccountCreated') {
			const { uid, accessToken, admin }: { uid: string, accessToken: string, admin: boolean } = req.body.data;
			authDB.insertOne({ uid, accessToken, admin });
		}
		res.send({});
	});

	app.listen(4004, () => {
		console.log('Running on 4004');
	});
}

start();
