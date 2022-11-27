const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const routes = require('./routes');
const connection = require('./config/database');
require('./config/passport');
const flash = require('connect-flash');

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
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(routes);
app.listen(3999);