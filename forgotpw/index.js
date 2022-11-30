import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { faker } from '@faker-js/faker';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

//holds a collection of all emails that are registered
// store uid along with email
const db = {};

// username: team0.clouddrive@gmail.com
// password: ourpassword

// return the verified emails (used for account creation with existing email)
app.get('/emails', (req, res) => {
	res.send(Object.keys(db));
});

app.get('/login/forgotpw', async (req, res) => {
	try {
		const { uid, email } = req.body;
		const otp = faker.internet.password();
		
		if (!(uid in db)) {
			res.status(400).json({
				message: 'NOT FOUND'
			}); return;
		}

		// right around here add a await call to another endpoint to change the password and mark a flag
		await axios.post('http://event-bus:4012/events', {
			type: "ChangePassword",
			data: {
				uid,
				email
			}
		});
		// let's create the transport (it's the postman/delivery-man who will send your emails)
		const myTransport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'team0.clouddrive@gmail.com', // your gmail account which you'll use to send the emails
				pass: 'ourpassword', // the password for your gmail account
			}
		});
		// defining the content of the email (I mean, what will be on the email)
		const mailOptions = {
			from: 'team0cloud<team0.clouddrive@gmail.com>', // from where the email is going, you can type anything or any name here, it'll be displayed as the sender to the person who receives it
			to: email, // the email address(es) where you want to send the emails to. If it's more than one person/email, seperate them with a comma, like here how I seperated the 3 users with a comma
			
			subject: 'Sending Some Freaking Email', // your email subject (optional but better to have it)
			text: `Hello there my sweetling! Let's send some freaking emails!\n Here is your one time password: ${otp}` // your email body in plain text format (optional) 
			
			// your email body in html format (optional)
			// if you want to send a customly and amazingly designed html body
			// instead of a boring plain text, then use this "html" property
			// instead of "text" property
			// html: `<h1 style="color: red;text-align:center">Hello there my sweetling!</h1>
			// 			<p style="text-align:center">Let's send some <span style="color: red">freaking</span> emails!</p>`,
		}
		
		// sending the email
		myTransport.sendMail(mailOptions, (err) => {
			if (err) {
				console.log(`Email failed to send!`);
				console.error(err);
			} else {
				console.log(`Email successfully sent!`);
			}
		})
		// should probably change this output later (not necessary)
		res.status(200).json(email);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.post('/events', (req, res) => {
	const {type, data } = req.body;
	if (type === 'AccountCreated') {
		const { uid , email } = data;
		db[uid] = email;
	} else if (type === 'AccountDeleted') {
		const { uid, email } = data;
		delete db[uid];
	}
	res.send({status: 'ok'});
});

app.listen(4004, () => {
	console.log('Listening on 4004');
});