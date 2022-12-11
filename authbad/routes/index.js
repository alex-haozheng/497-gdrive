const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../utils/utils').generatePassword;
const User = require('../config/database').models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
const axios = require('axios');

router.get('/', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/pre.html');
});

router.post('/register', async (req, res) => {
	if (!req.body.username || !req.body.email || !req.body.password) {
		// missing required fields
		res.redirect('/register');
	} else if ((await User.findOne({ username: req.body.username })) !== null) {
		// user already exists in database
		res.redirect('/login');
	} else {
		const { hash, salt } = generatePassword(req.body.password);
		const newUser = new User({
			username: req.body.username,
			hash: hash,
			salt: salt,
			admin: true
		});
		console.log('Sending Account Created Event...');
		/* axios.post('http://event-bus:4005/events', {
			type: 'AccountCreated',
			data: {
				uid: req.body.username,
				email: req.body.email
			}
		}); */
		console.log('Account Created Event Sent');
		newUser.save().then(user => {
			console.log(user);
		});
		res.redirect('/login');
	}
});

router.get('/register', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/register.html');
});

router.post('/unregister', isAuth, async (req, res) => {
	const username = req.body.username;
	await User.deleteOne({ username }, (err) => {
		if (err) console.log(err);
		console.log('Successful Account Deletion');
	});
	console.log('Sending Account Deleted Event...');
	/* axios.post('http://event-bus:4005/events', {
		type: 'AccountDeleted',
		data: {
			uid: username
		}
	}); */
	console.log('Account Deleted Event Sent');
	res.redirect('/login');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

router.get('/login', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/login.html');
});

router.get('/dashboard', isAuth, (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/success.html');
});

router.get('/auth-route', isAuth, (req, res) => {
	console.log('auth-route req.user');
	res.send('<div>Auth only route <a href="/logout">Logout</a></div>');
});

router.get('/admin-route', isAdmin, (req, res) => {
	console.log('admin-route req.user');
	res.send('<div>Admin only route</div>');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

router.get('/login-success', (req, res) => {
	console.log('login-success req.user:');
	console.log(req.user);
	axios.post('http://auth:4003/test-req', { hello: 'hola', user: req.user }, { withCredentials: true });
	res.redirect('/dashboard');
});

router.post('/test-req', (req, res) => {
	console.log('test-req req.user: ');
	console.log(req.user);
	console.log(req.body.hello);
	console.log(req.body.user);
	res.send({});
});

router.get('/login-failure', (req, res) => {
	console.log('failure login');
	console.log(req.user);
	res.redirect('login');
});

router.post('/events', async (req, res) => {
	// user deleted, password changed
	if (req.body.type === 'AdminAdded') {
		const username = req.body.data.uId;
		await User.findOneAndUpdate({ username: username }, { admin: true });
	} else if (req.body.type === 'AdminRemoved') {
		const username = req.body.data.uId;
		await User.findOneAndUpdate({ username: username }, { admin: false });
	} else if (req.body.type === 'ChangePassword') {
		const username = req.body.data.uid;
		const password = req.body.data.otp;
		const { hash, salt } = generatePassword(password);
		await User.findOneAndUpdate({ username: username }, { password: hash, salt: salt });
	}
	res.send({});
});

module.exports = router;
