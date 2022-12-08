const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const routes = require('./routes');
const connection = require('./config/database');
require('./config/passport');

const MongoStore = require('connect-mongo')(session);

require('dotenv').config();

const app = express();

// middleware and routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// use database for persistent storage of session. use secret to encrypt cookies. maxage for cookie expiration
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });
app.use(session({
    secret: 'f62165d78af7861ba67ffa6f1ea065547f39a52102eadfe0941698d5437e5902', // random bytes
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);
app.listen(4003);