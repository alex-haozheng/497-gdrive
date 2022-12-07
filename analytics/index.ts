import * as express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';
import { isAdmin } from './auth.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

setInterval(() => {
  
}, 1000 * 60 * 60 * 24); // run once a day

app.get('/analytics', isAdmin, (req, res) => {

});

app.listen(4004, () => {
  console.log('Listening on 4004');
});
