import * as express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createHmac } from 'crypto';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';

function initialize(passport) {
	async function authenticateUser(username, password, done) {
		const user = getUserByEmail(username);
		if (!user) return done(null, false, { message: 'Username DNE' });
		if (password !== user.password) {
			await new Promise(r => setTimeout(r, 1000)); // rate limiter
			return done(null, false, { message: 'Incorrect PW' });
		}
		return done(null, user);
	}
	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

const users = {};

initializePassport(passport, username => users[username]);

const app = express();

app.use(express.json());
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());

function hash(s) {
	return createHmac('sha256', 'secret').update(s).digest('hex');
}

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
);

app.post('/register', async (req, res) => {
	try {
		const info = req.body;
		const hashedPassword = hash(info.password);
		users[info.username] = {
			username: info.username,
			password: hashedPassword,
			email: info.email
		};
		res.redirect('/login');
	} catch {
		res.redirect('/register');
	}
});

app.listen(4005, () => {
	console.log('Listening on 4005');
});
