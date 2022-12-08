const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const generatePassword = require('./utils/utils.js').generatePassword;
const isAuth = require('./utils/authMiddleware.js').isAuth;
const isAdmin = require('./utils/authMiddleware.js').isAdmin;
const validatePassword = require('./utils/utils.js').validatePassword;

async function start() {
	const uri = process.env.DATABASE_URL;
	if (uri === undefined) {
		throw Error('DATABASE_URL environment variable is not specified');
	}
	const mongo = new MongoClient(uri);
	await mongo.connect();
	const connection = await Promise.resolve(mongo);
	const database = connection.db().collection('Users');

	const MongoStore = require('connect-mongo')(session);
	require('dotenv').config();
	const app = express();

	// middleware and routes
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	// use database for persistent storage of session. use secret to encrypt cookies. maxage for cookie expiration
	const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });
	app.use(
		session({
			secret: process.env.SECRET,
			resave: false,
			saveUninitialized: true,
			store: sessionStore,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24
			}
		})
	);

	const customFields = {
		usernameField: 'username',
		passwordField: 'password'
	};

	// Validate that user exists and that there is a password match.
	const validateCredentials = (username, password, done) => {
		database
			.findOne({ username: username })
			.then(async user => {
				if (!user) return done(null, false);
				const isValid = validatePassword(password, user.hash, user.salt);
				if (!isValid) return await new Promise(r => setTimeout(r, 1000)).then(x => done(null, false)); // rate limiter
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
		User.findById(userId)
			.then(user => done(null, user))
			.catch(err => done(err));
	});

	app.use(passport.initialize());
	app.use(passport.session());

	app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

	app.post('/register', async (req, res) => {
		if (!req.body.username || !req.body.email || !req.body.password) {
			// missing required fields
			res.redirect('/register');
		} else if ((await database.findOne({ username: req.body.username })) !== null) {
			// user already exists in database
			res.redirect('/login');
		} else {
			const username = req.body.username;
			const { hash, salt } = generatePassword(req.body.password);
			const admin = true;
			database.insertOne({ username, hash, salt, admin }, err => {
				if (err) console.log(err);
				console.log('Successful Account Creation');
			});
			axios.post('http://event-bus:4005/events', {
				type: 'AccountCreated',
				data: {
					uid: req.body.username,
					email: req.body.email
				}
			});
			res.redirect('/login');
		}
	});

	app.post('/unregister', isAuth, async (req, res) => {
		const username = req.body.username;
		await database.deleteOne({ username }, err => {
			if (err) console.log(err);
			console.log('Successful Account Deletion');
		});
		axios.post('http://event-bus:4005/events', {
			type: 'AccountDeleted',
			data: {
				uid: username
			}
		});
		res.redirect('/login');
	});

	app.get('/register', (req, res) => {
		res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/register.html');
	});

	app.get('/login', (req, res) => {
		res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/login.html');
	});

	app.get('/', (req, res) => {
		res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/pre.html');
	});

	app.get('/dashboard', isAuth, (req, res) => {
		res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/success.html');
	});

	app.get('/auth-route', isAuth, (req, res) => {
		res.send('<div>Auth only route <a href="/logout">Logout</a></div>');
	});

	app.get('/admin-route', isAdmin, (req, res) => {
		res.send('<div>Admin only route</div>');
	});

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/login');
	});

	app.get('/login-success', (req, res) => {
		res.redirect('/dashboard');
	});

	app.get('/login-failure', (req, res) => {
		res.redirect('login');
	});

	app.post('/events', async (req, res) => {
		// user deleted, password changed
		if (req.body.type === 'AdminAdded') {
			const username = req.body.data.uId;
			await database.findOneAndUpdate({ username: username }, { admin: true });
		} else if (req.body.type === 'AdminRemoved') {
			const username = req.body.data.uId;
			await database.findOneAndUpdate({ username: username }, { admin: false });
		} else if (req.body.type === 'ChangePassword') {
			const username = req.body.data.uid;
			const password = req.body.data.otp;
			const { hash, salt } = generatePassword(password);
			await database.findOneAndUpdate({ username: username }, { hash: hash, salt: salt });
		}
		res.send({});
	});

	app.listen(4003);
}

start();
