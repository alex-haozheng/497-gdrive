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

function generatePassword(password: string): { hash: string, salt: string, accessToken: string } {
	const salt: string = randomBytes(32).toString('hex');
	const accessToken: string = randomBytes(32).toString('hex');
	const hashedPassword: string = hash(password, salt);
	return {
		hash: hashedPassword,
		salt: salt,
		accessToken: accessToken
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
	console.log('Database Connection Success');
	let auth = await initDB(mongo);
	if (auth === null) throw Error('Database initialization failed');
	console.log('Database Init Success');

	app.post('/register', async (req, res) => {
		const { uid, email, password }: { uid: string; email: string; password: string } = req.body;
		console.log('Register');
		if (!uid || !email || !password) {
			console.log('Missing Information');
			res.status(400).send('Missing Information');
		} else if ((await auth.findOne({ uid: uid })) !== null) {
			console.log('User Already Exists');
			res.status(400).send('User Already Exists');
		} else {
			const { hash, salt, accessToken } = generatePassword(password);
			auth.insertOne({
				uid: uid,
				hash: hash,
				salt: salt,
				accessToken: accessToken,
				admin: true
			});
			console.log('Sending Account Created Event...');
			axios.post('http://event-bus:4012/events', {
				type: 'AccountCreated',
				data: {
					uid: uid,
					accessToken: accessToken
				}
			});
			console.log('Account Created Event Sent');
			res.send({ uid: uid, accessToken: accessToken });
		}
	});

	app.post('/login', async (req, res) => {
		const { uid, password }: { uid: string; password: string } = req.body;
		console.log('Login');
		console.log(uid);
		console.log(password);
		if (!uid || !password) {
			console.log('Missing Information');
			res.status(400).send('Missing Information');
		} else {
			const user = await auth.findOne({ uid: uid });
			console.log(user);
			if (user === null) {
				console.log('Incorrect uid');
				res.status(400).send('Incorrect uid');
			} else if (!validatePassword(password, user.hash, user.salt)) {
				console.log('Incorrect Password');
				res.status(400).send('Incorrect Password');
			} else {
				console.log('Successful Login');
				res.status(200).send({ uid: uid, accessToken: user.accessToken });
			}
		}
	});

	app.post('/unregister', async (req, res) => {
		const { uid, accessToken }: {uid: string, accessToken: string } = req.body;
		console.log('Unregister');
		if (!uid || !accessToken) {
			console.log('Missing Information');
			res.status(400).send('Missing Information');
		}
		const user = auth.findOne({ uid: uid });
		if (accessToken !== user.accessToken) {
			console.log('Wrong Access Token');
			res.status(400).send('Unauthorized Access');
		} else {
			await auth.deleteOne({ _id: uid }, err => {
				if (err) console.log(err);
				console.log('Successful Account Deletion');
			});
			console.log('Sending Account Deleted Event...');
			axios.post('http://event-bus:4012/events', {
				type: 'AccountDeleted',
				data: { uid }
			});
			console.log('Account Deleted Event Sent');
			console.log('Successfully Deleted Account');
			res.status(200).send('Successfully Deleted Account');
		}
	});

	app.post('/authData', async (req, res) => {
		const { uid }: { uid: string } = req.body;
		console.log(`Auth uid: ${uid}`);
		const user = await auth.findOne({ uid });
		console.log(`user: ${user}`);
		console.log(`accessToken: ${user.accessToken}`);
		console.log(`admin: ${user.admin}`);
		if (!user) {
			res.send({});
			return;
		}
		res.send({ dbAccessToken: user.accessToken, admin: user.admin });
	});

	app.post('/events', async (req, res) => {
		console.log('Auth Events');
		// user deleted, password changed
		if (req.body.type === 'AdminAdded') {
			const uid = req.body.data.uId;
			await auth.findOneAndUpdate({ uid: uid }, { admin: true });
		} else if (req.body.type === 'AdminRemoved') {
			const uid = req.body.data.uId;
			await auth.findOneAndUpdate({ uid: uid }, { admin: false });
		} else if (req.body.type === 'ChangePassword') {
			const uid = req.body.data.uid;
			const password = req.body.data.otp;
			const { hash, salt } = generatePassword(password);
			await auth.findOneAndUpdate({ uid: uid }, { password: hash, salt: salt });
		}
		res.send({});
	});

	app.listen(4003);
}

start();
