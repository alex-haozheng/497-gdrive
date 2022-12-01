import express from 'express';
import logger from 'morgan';
import cors from 'cors';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// users : file
const userFiles = {};

app.get('/users/list', (req, res) => {
	try {
		res.status(200).send({
			"files": Object.getOwnPropertyNames(userFiles)
		});
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get('/users/find', (req, res) => {
	try {
		const { uid } = req.body;
		res.status(200).send({
			'status': uid in userFiles
		});
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get('user/:uid/files', (req, res) => {
	try {
		const { uid } = req.params.uid;
		res.status(200).send({
			files: userFiles[uid]
		});
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get('user/:uid/files/search', (req, res) => {
	try {
		const { uid } = req.params.uid;
		const { keyword } = req.body;
		if (uid in userFiles) {
			const files = userFiles[uid];
			const arr = [];
			for (const s of files) {
				if (s.includes(keyword)) {
					arr.push(s);
				}
			}
			res.status(200).send({
				result: arr
			});
		} else {
			res.status(404).send({
				message: 'NOT FOUND'
			});
		}
	} catch (e) {
		res.status(500).send(e);
	}
});

app.post('/events', (req, res) => {
	const {type, data} = req.body;
	if (type === 'AccountCreated') {
		const { uid } = data;
		userFiles[uid] = [];
	} else if (type === 'AccountDeleted') {
		const { uid } = data;
		delete userFiles[uid];
		res.status(201).json(uid)
	} else if (type === 'FileCreated') {
		const { uid, fileName } = data;
		if (uid in userFiles) {
			userFiles[uid].push(fileName);
			res.status(201).json(uid)
		} else {
			res.status(400).json({ message: 'NOT FOUND'});
		}
	} else if (type === 'FileDeleted') {
		const { uid, fileName } = data;
		if (userFiles.has(uid)) {
			delete userFiles[uid][userFiles[uid].indexOf(fileName)];
			res.status(201).json(uid)
		} else {
			res.status(400).json({ message: 'NOT FOUND'});
		}
	}
});
app.listen(4000, () => {
	console.log('Listening on 4000');
});