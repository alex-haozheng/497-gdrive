const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../utils/utils').generatePassword;
const User = require('../config/database').models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

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
		axios.post('http://event-bus:4005/events', {
			type: 'AccountCreated',
			data: {
				uid: req.body.username,
				email: req.body.email
			}
		});
		newUser.save().then(user => {
			console.log(user);
		});
		res.redirect('/login');
	}
});

router.get('/register', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/register.html');
});

router.get('/login', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/login.html');
});

router.get('/', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/pre.html');
});

router.get('/dashboard', isAuth, (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/success.html');
});

router.get('/auth-route', isAuth, (req, res) => {
	res.send('<div>Auth only route <a href="/logout">Logout</a></div>');
});

router.get('/admin-route', isAdmin, (req, res) => {
	res.send('<div>Admin only route</div>');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

router.get('/login-success', (req, res) => {
	res.redirect('/dashboard');
});

router.get('/login-failure', (req, res) => {
	res.redirect('login');
});

router.post('/events', async (req, res) => {
	// user deleted, password changed
	if (req.body.type === 'AccountDeleted') {
		const username = req.body.data.uid;
		await User.deleteOne({ username }, (err) => {
			if (err) console.log(err);
			console.log('Successful Account Deletion');
		});
	} else if (req.body.type === 'AdminAdded') {
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
