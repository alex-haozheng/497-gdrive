import * as express from 'express';
import axios from 'axios';
import cors from 'cors';
import { isAuth, isAdmin } from './auth.js';
import stringDistance from './utils.js';

const app = express();

app.use(express.json());
app.use(cors());

const blacklist: string[] = ['fork', 'raptor', 'java', 'jrk', 'mcboatface']; // list of words to disallow from comments
const accepted: string = 'accepted'; // hard code to prevent mistypes. ideally would import from status file and use globally across all files
const rejected: string = 'rejected';
let threshold: number = .2;

interface File {
	id: string,
	content: string,
	postId: string
}

app.post('/blacklist/add/:word', isAdmin, async (req, res) => {
    blacklist.push(req.body.word);
    res.status(200).send({});
});

app.delete('/blacklist/remove/:word', isAdmin, async (req, res) => {
    const i = blacklist.indexOf(req.body.word);
    if (i === -1) {
        res.status(404).send({});
        return;
    }
    blacklist.splice(i, 1);
    res.status(200).send({});
});

app.put('/blacklist/update/threshold', isAdmin, async (req, res) => {
    if (req.body.threshold === undefined) {
        res.status(404).send({});
        return;
    }
    threshold = req.body.threshold;
    res.status(200).send({});
});

app.post('/events', async (req, res) => {
	const { type, data }: { type: string; data: File } = req.body;
    if (type === 'FileCreated' || type === 'FileUpdated') {
        let status = accepted; // status accepts by default
        if (data.content === undefined) {
            res.send({}); //?! do you have to send a response before a return
            return;
        }
		for (let fword of data.content.split(/[^a-zA-Z\d]/)) { // split file string by punctuation or whitespace
            for (const bword of blacklist) {
                if (stringDistance(fword, bword) / ((fword.length + bword.length) >> 1) <= threshold) { // strings too similar, status = rejected
                    status = rejected; // status rejected if word from blacklist found in comment
                    break;
                }
            }
		}
		await axios.post('http://event-bus:4015/events', {
			type: 'FileModerated',
			data: {
				...data, // spread data object contents
                status
			}
		});
	}
	res.send({});
});

app.listen(4003, () => {
	console.log('Listening on 4003');
});
