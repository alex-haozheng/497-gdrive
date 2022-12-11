import express, { Express } from 'express';
import logger from 'morgan';
import axios from 'axios';

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());

// YURI: event messages services (admin, profile, tag) is listening for
// admin and profile and auth services is listening for AccountDeleted event message  
// forgotpw and filequery is listening for AccountDeleted event message (Alex)
interface AccountDeleted {
  type: 'AccountDeleted',
  data: {
    uid: string
  }
}

// tag service is listening for FileDeleted event message
// filequery is listening for FileDeleted event message (Alex)
interface FileDeleted {
  type: 'FileDeleted',
  data: {
    uid: string,
    fileId: string
  }
}

// ALEX: 
// forgotpw and filequery is listening for AccountCreated event message
// authentication is listening for AccountCreated event message
interface AccountCreated {
  type: 'AccountCreated',
  data: {
    uid: string,
    email: string
  }
}

// filequery is listening for filecreated event message
interface FileCreated {
  type: 'FileCreated',
  data: {
    uid: string,
    fileId: string
  }
}

//fileCompression
interface FileOpened {
  type: 'FileOpened',
  data: {
    fileId: string
  }
}

// KAYS:
interface FileUpdated {
  type: 'FileUpdated',
  data: {
    file: {
      fileId: string,
      content: string
    }
  }
}

interface ChangedPassword {
  type: 'ChangedPassword',
  data: {
    file: {
      fileId: string,
      content: string
    }
  }
}

interface File {
  fileId: string,
  content: string
}

interface ShootFileAnalytics {
  type: 'FileAnalytics'
}

interface GetFileAnalytics {
  type: 'FileAnalytics',
  data: {
    files: File[]
  }
}

interface ShootWordAnalytics {
  type: 'ShootWordAnalytics'
}

interface GetWordAnalytics {
  type: 'GetWordAnalytics',
  data: {
    badwords: []
  }
}

interface AdminAdded {
  type: 'AdminAdded'
}

interface AdminRemoved {
  type: 'AdminRemoved'
}

// JUSTIN:
// TODO

type MESSAGETYPE = AccountCreated | AccountDeleted | FileCreated | FileUpdated | FileDeleted | FileOpened | ChangedPassword | ShootWordAnalytics | GetWordAnalytics | ShootFileAnalytics | GetFileAnalytics | AdminAdded | AdminRemoved;

app.post('/events', (req, res) => {
  const event : MESSAGETYPE = req.body;

  console.log(req.body.type);
  console.log(req.body.data);

  // yuri's services
  axios.post('http://admin:4000/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://tag:4001/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://profile:4002/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://requests:4013/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  // kays service
  axios.post('http://auth:4003/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://analytics:4004/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://moderator:4005/events', event).catch((err: Error) => {
    console.log(err.message);
  });
  
  // alex's service
  axios.post('http://forgotpw:4006/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://filequery:4007/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://filecompression:4008/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  // justin's service 
  // TODO
  axios.post('http://fileservice:4009/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://timelogger:4010/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  axios.post('http://uploaddownload:4011/events', event).catch((err: Error) => {
    console.log(err.message);
  });

  res.send({}); // don't delete. if res doesn't send a response, requests never get satisfied
});

app.listen(4012, () => {
  console.log('Listening on 4012');
});
