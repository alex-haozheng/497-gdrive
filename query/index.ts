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
		const { uId }: { uId: string } = req.body;
		res.status(200).send({
			'status': uId in userFiles
		});
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get('/user/:uId/files', (req: Request, res: Response) => {
	try {
		const uId = req.params.uId;
		console.log(uId);
		if (uId in userFiles) {
			res.status(200).send({
				files: userFiles[uId]
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

app.get('/user/:uId/files/search', (req: Request, res: Response) => {
	try {
		const uId = req.params.uId;
		const { keyword }: { keyword: string } = req.body;
		if (uId in userFiles) {
			const files = userFiles[uId];
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
		const { uId }: { uId: string } = data;
		userFiles[uId] = [];
	} else if (type === 'AccountDeleted') {
		const { uId }: { uId: string } = data;
		delete userFiles[uId];
		res.status(201).json(uId)
	} else if (type === 'FileCreated') {
		const { uId, fileId }: { uId: string, fileId: string } = data;
		if (uId in userFiles) {
			userFiles[uId].push(fileId);
			res.status(201).json(uId)
		} else {
			res.status(400).json({ message: 'NOT FOUND'});
		}
	} else if (type === 'FileDeleted') {
		const { uId, fileId }: { uId: string, fileId: string } = data;
		if (uId in userFiles) {
			delete userFiles[uId][userFiles[uId].indexOf(fileId)];
			res.status(201).json(uId)
		} else {
			res.status(400).json({ message: 'NOT FOUND'});
		}
	}
});
app.listen(4007, () => {
	console.log('Listening on 4007');
});