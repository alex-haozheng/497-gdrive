import * as express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();

app.use(express.json());
app.use(cors());

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
      next(); // calls next middleware
  } else {
      res.status(401).send('Unauthorized access');
  }
}

function isAdmin (req, res, next) {
  if (req.isAuthenticated() && req.user.admin) {
      next();
  } else {
      res.status(401).send('Unauthorized admin access');
  }
}

interface Analytics {
	numFiles: number;
	readabilityDistribution: {
		[key: string | number]: number;
	},
  badfiles: string[];
}

interface File {
  fileId: string,
  content: string
}

let data: Analytics;
let files = [];
let badfiles;

// for Justin to add to event-bus
/* app.post('/events', (req, res) => {
	if (req.body.type === 'Analytics') {
		res.send(files);
	}
}); */

setInterval(() => {
	Promise.all(
    [axios.post('http://event-bus:4012/events', {
		type: 'ShootFileAnalytics'
	}), axios.post('http://event-bus:4012/events', {
		type: 'ShootWordAnalytics'
	})]);

  const analytics: Analytics = {
    numFiles: Object.entries(files).length,
    readabilityDistribution: {},
    badfiles: badfiles.slice()
  }

  // uses Coleman-Liau index
  // L = avg number of letters per 100 words
  // W = avg number of sentences per 100 words
  // index = 0.0588 * L - 0.296 * S - 15.8;
  const indexes: number[] = [];

  for (const file of files) {
    const sentences: string[] = file.content.split("[\\p{Punct}\\s]+");
    const words: string[] = file.content.split(/[^a-zA-Z\d]/);
    const letters: string[] = words.join('').split('');
    const L: number = letters.length / words.length * 100;
    const S: number = sentences.length / letters.length * 100;
    const index: number = 0.0588 * L - 0.296 * S - 15.8;
    indexes.push(Math.floor(index));
  }

  indexes.sort((a, b) => a <= b ? -1 : 1);

  function condense(data: number[]) {
    let i: number = 0;
    const distribution: { [key: string | number]: number } = {};
    while (i < data.length) {
      let j: number = i;
      while (data[++i] === data[j]);
      distribution[data[j]] = i - j;
    }
    return distribution;
  } // condense same data to one point and count. Ex: 1 1 1 1 2 2 2 => { 1: 4, 2: 3 }

  analytics.readabilityDistribution = condense(indexes);
  data = analytics;
}, 1000 * 60 * 60 * 24); // run once a day

app.post('/events', (req, res) => {
  if (req.body.type === 'GetWordAnalytics') {
    badfiles = req.body.data.badfiles;
  } else if (req.body.type === 'GetFileAnalytics') {
    files = req.body.data.files
  }

});

app.get('/analytics', isAdmin, (req, res) => {
  res.send(data);
});

app.listen(4004, () => {
	console.log('Listening on 4004');
});
