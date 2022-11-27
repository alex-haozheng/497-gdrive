const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../utils/utils').generatePassword;
const User = require('../config/database').models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
const axios = require('axios');
const { authenticate } = require('passport');

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

router.post('/signin', async (req, res) => {
	if (!req.body.username || !req.body.password) {
		// missing required fields
		res.setHeader('Content-Type', 'text/html');
		res.write('<h3>Username or Password Missing</h3>');
		res.write(signupinHTML);
		res.end();
		return;
	} else if (User.findOne({ username: req.body.username })) {
		// user already exists in database
		const status = await passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' });
		if (status) {
			res.send(successHTML);
		} else {
			res.setHeader('Content-Type', 'text/html');
			res.write('<h3>Incorrect username or password</h3>');
			res.write(signupinHTML);
			res.end();
		}
		return;
	} else {
		const { hash, salt } = generatePassword(req.body.password);
		const newUser = new User({
			username: req.body.username,
			hash: hash,
			salt: salt,
			admin: true
		});
		await newUser.save();
		await passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' });
		res.send(successHTML);
	}
});

router.get('/', (req, res) => {
	res.send(signupinHTML);
});

router.get('/auth-route', isAuth, (req, res) => {
	res.send('<div>Auth only route <a href="/logout">Logout</a></div>');
});

router.get('/admin-route', isAdmin, (req, res) => {
	res.send('<div>Admin only route</div>');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/login-success', (req, res) => {
	res.send(true);
});

router.get('/login-failure', (req, res) => {
	res.send(false);
});

module.exports = router;
