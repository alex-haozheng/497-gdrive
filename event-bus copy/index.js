import express from 'express';
import logger from 'morgan';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.post('/events', (req, res) => {

  console.log(req.body.type);
  console.log(req.body.data);

  // yuri's services
  axios.post('http://admin:4000/events', req.body).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://tag:4001/events', req.body).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://profile:4002/events', req.body).catch((err) => {
    console.log(err.message);
  });

  // kays' services
  axios.post('http://auth:4003/events', req.body).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://analytics:4004/events', req.body).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://moderator:4005/events', req.body).catch((err) => {
    console.log(err.message);
  });
  
  // alex's services
  axios.post('http://forgotpw:4006/events', req.body).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://filequery:4007/events', req.body).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://filecompression:4008/events', req.body).catch((err) => {
    console.log(err.message);
  });

  // justin's services
  axios.post('http://fileservice:4009/events', req.body).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://timelogger:4010/events', req.body).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://uploaddownload:4011/events', req.body).catch((err) => {
    console.log(err.message);
  });

  res.send({});
});

app.listen(4012, () => {
  console.log('Listening on 4012');
});
