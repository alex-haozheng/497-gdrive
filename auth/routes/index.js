const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../utils/utils').generatePassword;
const User = require('../config/database').models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }));

router.post('/register', async (req, res, next) => {
	if (!req.body.username || !req.body.password) {
		res.setHeader('Content-Type', 'text/html');
		res.write('<h3>' + 'username and password required' + '</h3>');
		res.send('username and password required');
		return;
	}
	if (User.findOne({ username: req.body.username })) {
		req.flash('registered', 'user already exists!');
		res.redirect('/login');
		return;
	}
	const { hash, salt } = generatePassword(req.body.password);

	const newUser = new User({
		username: req.body.username,
		hash: hash,
		salt: salt,
		admin: true
	});

	newUser.save().then(user => {
		console.log(user);
	});

	res.redirect('/login');
});

router.get('/', (req, res, next) => {
	res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get('/login', async (req, res, next) => {
	const form =
		'<h1>Login Page</h1><form method="POST" action="/login">\
    	Enter Username:<br><input type="text" name="username">\
    	<br>Enter Password:<br><input type="password" name="password">\
    	<br><br><input type="submit" value="Submit"></form>';
	res.setHeader('Content-Type', 'text/html');
	const flashMessage = await req.flash('registered');
	if (flashMessage) {
		res.write('<h3>' + flashMessage.toString() + '</h3>');
	}
	res.write(form);
	res.end();
});

router.get('/register', (req, res, next) => {
	const form =
		'<h1>Register Page</h1><form method="post" action="register">\
        Enter Username:<br><input type="text" name="username">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form>';
	res.send(form);
});

router.get('/protected-route', isAuth, (req, res, next) => {
	res.send('You made it to the route. <a href="/logout">Logout</a>');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
	res.send('You made it to the admin route.');
});

router.get('/logout', (req, res, next) => {
	req.logout();
	res.redirect('/login');
});

router.get('/login-success', (req, res, next) => {
	res.send('You successfully logged in. --> <a href="/protected-route">Go to protected route</a>');
});

router.get('/login-failure', (req, res, next) => {
	res.redirect('/login');
});

module.exports = router;
