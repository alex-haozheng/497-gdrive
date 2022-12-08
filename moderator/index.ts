import * as express from 'express';
import axios from 'axios';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { isIntersectionTypeNode } from 'typescript';

const app = express();

interface File {
	fileId: string;
	content: string;
}

async function connectDB() {
	const uri = process.env.DATABASE_URL;
	if (uri === undefined) {
		throw Error('DATABASE_URL environment variable is not specified');
	}
	const mongo = new MongoClient(uri);
	await mongo.connect();
	return await Promise.resolve(mongo);
}

async function initBlacklistDB(mongo) {
	const db = mongo.db();
	const blacklist = db.collection('blacklist');
	await blacklist.insertOne({ key: 'blacklist', blacklist: ['fork', 'raptor', 'java', 'jrk', 'mcboatface'] });
	return blacklist;
}

async function initBadfilesDB(mongo) {
	const db = mongo.db();
	const badfiles = db.collection('badfiles');
	return badfiles;
}

async function getBlacklist(blacklistDB) {
	const blacklistObj = await blacklistDB.findOne({ key: 'blacklist' });
	return blacklistObj.blacklist || [];
}

async function getBadfiles(badfilesDB) {
	const badfilesObj = await badfilesDB.find();
	const badfiles: { fileId: string, content: string }[] = [];
	await badfilesObj.forEach(doc => {
		badfiles.push({ fileId: doc.fileId, content: doc.content }); 
	});
    return badfiles;
}

async function start() {
	const mongo = await connectDB();
	
    const blacklistDB = await initBlacklistDB(mongo);
	const badfilesDB = await initBadfilesDB(mongo);
    const blacklist = await getBlacklist(blacklistDB); // in memory at start of service
	
    app.use(express.json());
	app.use(cors());

	app.post('/events', async (req, res) => {
		const { type, data }: { type: string; data: { file: File } } = req.body;
		const file: File = data.file;
		if (type === 'FileModified') {
            const badfile = await badfilesDB.findOne({ fileId: file.fileId });
			for (let fword of file.content.split(/[^a-zA-Z\d]/)) {
				// split file string by punctuation or whitespace
				for (const bword of blacklist) {
					if (stringDistance(fword, bword) / ((fword.length + bword.length) >> 1) <= 0.2) {
                        if (badfile) {
                            await badfilesDB.updateOne({ fileId: file.fileId }, { content: file.content });
                        } else {
                            await badfilesDB.insertOne({ fileId: file.fileId, content: file.content });
                        }
						break;
					}
				}
			}
		} else if (type === 'ShootWordAnalytics') {
            const badfiles = await getBadfiles(badfilesDB);
			axios.post('http://event-bus:4005/events', {
				type: 'GetWordAnalytics',
				data: {
					files: badfiles
				}
			});
		}
		res.send({});
	});

	app.listen(4005, () => {
		console.log('Listening on 4005');
	});
}

function stringDistance(s: string, t: string): number {
	const m: number = s.length,
		n: number = t.length;
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
}

start();
