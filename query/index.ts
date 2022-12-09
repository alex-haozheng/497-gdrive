import * as express from 'express';
import { Request, Response } from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// users : file
const userFiles = {};

app.get('/users/list', (req: Request, res: Response) => {
	try {
		res.status(200).send({
			"files": Object.getOwnPropertyNames(userFiles)
		});
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get('/users/find', (req: Request, res: Response) => {
	try {
		const { uid }: { uid: string } = req.body;
		res.status(200).send({
			'status': uid in userFiles
		});
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get('user/:uid/files', (req: Request, res: Response) => {
	try {
		const uid = req.params.uid;
		res.status(200).send({
			files: userFiles[uid]
		});
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get('user/:uid/files/search', (req: Request, res: Response) => {
	try {
		const uid = req.params.uid;
		const { keyword }: { keyword: string } = req.body;
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

app.post('/events', (req: Request, res: Response) => {
	const {type, data} = req.body;
	if (type === 'AccountCreated') {
		const { uid }: { uid: string } = data;
		userFiles[uid] = [];
	} else if (type === 'AccountDeleted') {
		const { uid }: { uid: string } = data;
		delete userFiles[uid];
		res.status(201).json(uid)
	} else if (type === 'FileCreated') {
		const { uid, fileId }: { uid: string, fileId: string } = data;
		if (uid in userFiles) {
			userFiles[uid].push(fileId);
			res.status(201).json(uid)
		} else {
			res.status(400).json({ message: 'NOT FOUND'});
		}
	} else if (type === 'FileDeleted') {
		const { uid, fileId }: { uid: string, fileId: string } = data;
		if (uid in userFiles) {
			delete userFiles[uid][userFiles[uid].indexOf(fileId)];
			res.status(201).json(uid)
		} else {
			res.status(400).json({ message: 'NOT FOUND'});
		}
	}
});
app.listen(4007, () => {
	console.log('Listening on 4007');
});