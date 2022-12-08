import * as express from 'express';
import axios from 'axios';
import cors from 'cors';
import { isAuth, isAdmin } from './auth.js';

const app = express();

app.use(express.json());
app.use(cors());

const blacklist: string[] = ['fork', 'raptor', 'java', 'jrk', 'mcboatface']; // list of words to disallow from comments

interface File {
	fileId: string,
	content: string
}

const badfiles: Map<string, File> = new Map();

function stringDistance(s: string, t: string): number {
    const m: number = s.length, n: number = t.length;
    if (n * m === 0) return m + n;
    const dp: number[][] = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; ++i) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; ++j) {
        dp[0][j] = j;
    }
    for (let i = 1; i <= m; ++i) {
        for (let j = 1; j <= n; ++j) {
            if (s[i - 1] === t[j - 1]) {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] - 1);
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }
    return dp[m][n];
};

app.post('/events', async (req, res) => {
	const { type, data }: { type: string; data: { file: File } } = req.body;
    const file: File = data.file;
    if (type === 'FileModified') {
		for (let fword of file.content.split(/[^a-zA-Z\d]/)) { // split file string by punctuation or whitespace
            for (const bword of blacklist) {
                if (stringDistance(fword, bword) / ((fword.length + bword.length) >> 1) <= .2) { // strings too similar, status = rejected
                    badfiles.set(file.fileId, {
                        fileId: file.fileId,
                        content: file.content
                    }); // status rejected if word from blacklist found in comment
                    break;
                }
            }
		}
	} else if (type === 'ShootWordAnalytics') {
        axios.post('http://event-bus:4005/events', {
            type: 'GetWordAnalytics',
            data: {
                badfiles: badfiles
            }
        });
    } 
	res.send({});
});

app.listen(4005, () => {
	console.log('Listening on 4005');
});
