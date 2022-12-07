import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import { encode, decode } from 'lossless-text-compression';
import JSZip from 'jszip';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// fileid: compressedContent
const db = {}

app.get('user/:id/file/zip', (req, res) => {
	const { fileid } = req.body;
	try {
		if (fileid in db) {
			const zip = new JSZip();
			zip.file(fileid + '.txt', db[fileid]);
			res.status(200);
		} else {
			res.status(400).json({message: 'NOT FOUND'});
		}
	} catch (e) {
		res.status(500).send(e);
	}
});

app.post('/events', (req, res) => {
	const {type, data} = req.body;
	if (type === 'FileOpened') {
		try {
			const { fileid } = data;
			if (fileid in db) {
				const content = decode(db[fileid]);
				res.status(200).json({content});
			} else {
				res.status(400).json({message: 'NOT FOUND'});
			}
		} catch (e) {
			res.status(500).send(e);
		}
	} else if (type === 'FileModified') {
		try {
			const { fileid, content } = data;
			if (fileid in db) {
				const newContent = encode(content);
				db[fileid] = newContent;
				res.status(201).json('successful compression');
			} else {
				res.status(400).json({message: 'NOT FOUND'});
			}
		} catch (e) {
			res.status(500).send(e);
		}
	}

});