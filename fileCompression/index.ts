import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import { encode, decode } from 'lossless-text-compression';
const JSZip = require('jszip');

const app = express();

app.use(express.json());
app.use(cors());

// fileId: compressedContent
const db = {"xs": encode('test')}

app.get('/user/file/zip', async (req: Request, res: Response) => {
	const { fileId }: { fileId: string } = req.body;
	try {
		if (fileId in db) {
			const zip = new JSZip();
			zip.file(fileId + '.txt', db[fileId]);
			var promise = null;
			if (JSZip.support.uint8array) {
				promise = await zip.generateAsync({type : "uint8array"});
			} else {
				promise = await zip.generateAsync({type : "string"});
			}
			res.status(200).send(promise);
		} else {
			res.status(400).json({message: 'NOT FOUND'});
		}
	} catch (e) {
		res.status(500).send(e);
	}
});

app.post('/events', (req: Request, res: Response) => {
	const {type, data}: {type: string, data: { fileId: string, content?: string }} = req.body;
	if (type === 'FileOpened') {
		try {
			const { fileId } = data;
			if (fileId in db) {
				const content = decode(db[fileId]);
				res.status(200).json({content});
			} else {
				res.status(400).json({message: 'NOT FOUND'});
			}
		} catch (e) {
			res.status(500).send(e);
		}
	} else if (type === 'FileModified') {
		try {
			const { fileId, content } = data;
			if (fileId in db) {
				const newContent = encode(content);
				db[fileId] = newContent;
				res.status(201).json('successful compression');
			} else {
				res.status(400).json({message: 'NOT FOUND'});
			}
		} catch (e) {
			res.status(500).send(e);
		}
	}
});

app.listen(4008, () => {
	console.log('Listening on 4008');
});