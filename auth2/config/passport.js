const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const database = require('./database').database;
const validatePassword = require('../utils/utils').validatePassword;

// Custom fields for username and password. Frontend may call username and password fields something different.
const customFields = {
	usernameField: 'username',
	passwordField: 'password'
};

// Validate that user exists and that there is a password match. 
const validateCredentials = (username, password, done) => {
	database.findOne({ username: username })
		.then(async user => {
			if (!user) return done(null, false);
			const isValid = validatePassword(password, user.hash, user.salt);
			if (!isValid) return await new Promise(r => setTimeout(r, 1000)).then((x) => done(null, false)); // rate limiter
			else return done(null, user);
		})
		.catch(err => {
			done(err);
		});
};

const strategy = new LocalStrategy(customFields, validateCredentials);
passport.use(strategy);

// add passport.user field to session
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// add user field to req
passport.deserializeUser((userId, done) => {
	User.findById(userId).then(user => done(null, user)).catch(err => done(err));
});
