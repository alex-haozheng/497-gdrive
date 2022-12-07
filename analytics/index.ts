import * as express from 'express';
import * as cors from 'cors';
import axios from 'axios';
const app = express();
import { Analytics, File } from './interfaces.js';
import { isAdmin, processFiles, condense } from './utils.js';  

app.use(express.json());
app.use(cors());

let files: File[] = [];
let badfiles: File[] = [];
const analytics: Analytics = {
	numFiles: files.length,
	readabilityDistribution: {},
	badfiles: badfiles
};

setInterval(() => {
	Promise.all([
		axios.post('http://event-bus:4012/events', {
			type: 'ShootFileAnalytics'
		}),
		axios.post('http://event-bus:4012/events', {
			type: 'ShootWordAnalytics'
		})
	]);

	setTimeout(() => {
		const indexes: number[] = processFiles(files);
		analytics.numFiles = files.length;
		analytics.readabilityDistribution = condense(indexes);
		analytics.badfiles = badfiles;
	}, 1000 * 60); // wait for ShootAnalytics events to get to other services, and for GetAnalytics events to come in. No rush, we'll wait one minute. This is a completely backend async service, not worried about responding to client quickly.
}, 1000 * 60 * 60 * 24); // run once a day

app.post('/events', (req, res) => {
	if (req.body.type === 'GetWordAnalytics') {
		badfiles = req.body.data.badfiles;
	} else if (req.body.type === 'GetFileAnalytics') {
		files = req.body.data.files;
	}
});

app.get('/analytics', isAdmin, (req, res) => {
	res.send(analytics);
});

app.listen(4004, () => {
	console.log('Listening on 4004');
});
