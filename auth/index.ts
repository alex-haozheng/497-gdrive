import * as express from 'express';
import cors from 'cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const app = express();

// idea to have admins ask for user data, get their accesstoken, and then use that accesstoken to access user files. File services prompt user to enter accessToken

app.use(express.json());
app.use(cors());

interface User {
    username: string,
    password: string
}

interface Users {
    [key: string]: User
}

app.post('/login', (req, res) => {

});

const users: Users = {};

// admins can add bad words to moderator service blacklist

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

app.listen(4005, () => {
  console.log('Listening on 4005');
});
