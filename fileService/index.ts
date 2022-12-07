import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();

/* app.post('/events', async (req, res) => {
    if (req.body.type === 'ShootFileAnalytics') {
        res.send(files);
	}
}); */ // this is Kays who added this. Just wrote this down because I need you to send me the array of files

app.use(logger('dev'));
app.use(express.json());
app.use(cors());