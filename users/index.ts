import * as express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();

// idea to have admins ask for user data, get their accesstoken, and then use that accesstoken to access user files. File services prompt user to enter accessToken

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

interface User {
    username: string,
    email: string,
    accessToken: string,
    password: string
}

interface Users {
    [key: string]: User
}

const users: Users = {};
const blacklistedUsers = new Set();

// admins can add bad words to moderator service blacklist

app.get('/users/get/:userId/accessToken', (req, res) => {
    // need to check for authenticated user or admin access
    if (!(req.params.userId in users)) {
        res.status(404).send({});
        return;
    }
    res.send(users[req.params.userId].accessToken);
});
  
app.get('/users', (req, res) => {
    res.send(Object.values(users).map(user => ({username: user.username, email: user.email, accessToken: user.accessToken})));
});

app.post('users/ban/:username', (req, res) => {
    if (!(req.params.username in users)) {
        res.status(404).send({});
        return;
    }
    blacklistedUsers.add(req.params.username);
    await axios.post('http://event-bus:4005/events', {
      type: 'UserBanned',
      data: {
        username
      },
    });
    res.status(200).send({});
});

app.delete('users/unban/:username', (req, res) => {
    const i = blacklistedEmails.indexOf(req.params.email);
    if (i === -1) {
        res.status(404).send({});
        return;
    }
    blacklistedEmails.splice(i, 1);
    res.status(200).send({});
});

app.get('/users/:username', async (req, res) => {
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id, content });
    commentsByPostId[req.params.id] = comments;
  
    await axios.post('http://event-bus:4005/events', {
      type: 'UserBanned',
      data: {
        id,
        content,
        postId: req.params.id,
      },
    });
  
    res.status(201).send(comments);
  });

app.post('/users/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id, content });
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://event-bus:4005/events', {
    type: 'CommentCreated',
    data: {
      id,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.get('/events', (req, res) => {
    if (req.body.type === 'UserCreated') {
        const user = req.body.data.user;
        users[user.username] = user;
    } else if (req.body.type === 'UserDeleted') {

    }
    else if (req.body.type === 'UpdateAccessToken') {
        // must be authenticated request from authentication service
        if (!(req.body.data.user.username in users)) {
            res.status(404).send({});
            return;
        }
        users[req.body.userId].accessToken = req.body.accessToken;
        res.status(200).send({});
    } else if (req.body.type === 'UserBanned') {
        const user = req.body.data.user;
        if (!(user.username in users)) {
            res.status(404).send({});
            return;
        }
        blacklistedUsers.add(user.username);
        await axios.post('http://event-bus:4005/events', {
          type: 'UserBanned',
          data: {
            id,
            content,
            postId: req.params.id,
          },
        });
    } else if (req.body.type === 'UserUnbanned') {

    }
    res.send({});
});

app.listen(4004, () => {
  console.log('Listening on 4004');
});
