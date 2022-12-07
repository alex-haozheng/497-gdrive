import * as express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// this service doesn't make much sense we already have user data in profile and auth



app.listen(4004, () => {
  console.log('Listening on 4004');
});
