import * as express from 'express';
import * as cors from 'cors';
import axios from 'axios';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function hash(password: string, salt: string): string {
	return pbkdf2Sync(password, salt, 1000000, 32, 'sha256').toString('hex');
}

function generatePassword(password: string): { hash: string; salt: string } {
	const salt: string = randomBytes(32).toString('hex');
	const hashedPassword: string = hash(password, salt);
	return {
		hash: hashedPassword,
		salt: salt
	};
}

function validatePassword(password: string, pwhash: string, salt: string): boolean {
	return hash(password, salt) === pwhash;
}

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
	let auth = await initDB(mongo);
	if (auth === null) throw Error('Database initialization failed');

	app.post('/register', async (req, res) => {
		const { username, email, password }: { username: string; email: string; password: string } = req.body;
		if (!username || !email || !password) {
			res.status(400).send('Username, Email, and Password Required');
		} else if ((await auth.findOne({ username: username })) !== null) {
			res.status(400).send('User Already Exists');
		} else {
			const { hash, salt } = generatePassword(password);
			auth.insertOne({
				username: username,
				hash: hash,
				salt: salt,
				admin: true
			});
			axios.post('http://event-bus:4005/events', {
				type: 'AccountCreated',
				data: {
					uid: req.body.username,
					email: req.body.email
				}
			});
			res.send({ username: username, admin: true });
		}
	});

	app.post('/login', async (req, res) => {
		const { username, password }: { username: string; password: string } = req.body;
		if (!username || !password) {
			res.status(400).send('Missing Information');
		} else {
			const user = await auth.findOne({ username: username });
			if (user === null) {
				res.status(400).send('Incorrect Username');
			} else if (!validatePassword(password, user.hash, user.salt)) {
				res.status(400).send('Inconnect Password');
			} else {
				res.status(200).send({uid: user._id, admin: user.admin});
			}
		}
	});

	app.post('/unregister', async (req, res) => {
		const uid = req.body.uid;
		await auth.deleteOne({ _id: uid }, err => {
			if (err) console.log(err);
			console.log('Successful Account Deletion');
		});
		console.log('Sending Account Deleted Event...');
		axios.post('http://event-bus:4005/events', {
			type: 'AccountDeleted',
			data: {
				uid: username
			}
		});
		console.log('Account Deleted Event Sent');
		res.redirect('/login');
	});

	app.post('/events', async (req, res) => {
		// user deleted, password changed
		if (req.body.type === 'AdminAdded') {
			const username = req.body.data.uId;
			await auth.findOneAndUpdate({ username: username }, { admin: true });
		} else if (req.body.type === 'AdminRemoved') {
			const username = req.body.data.uId;
			await auth.findOneAndUpdate({ username: username }, { admin: false });
		} else if (req.body.type === 'ChangePassword') {
			const username = req.body.data.uid;
			const password = req.body.data.otp;
			const { hash, salt } = generatePassword(password);
			await auth.findOneAndUpdate({ username: username }, { password: hash, salt: salt });
		}
		res.send({});
	});

	app.listen(4003);
}

start();
