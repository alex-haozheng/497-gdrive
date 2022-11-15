import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import nodemailer from 'nodemailer';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.get('/login/:email/forgotpw', (req, res) => {
	const email = req.params.email;
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
		from: 'SilvenLEAF<team0.clouddrive@gmail.com>', // from where the email is going, you can type anything or any name here, it'll be displayed as the sender to the person who receives it
		to: email, // the email address(es) where you want to send the emails to. If it's more than one person/email, seperate them with a comma, like here how I seperated the 3 users with a comma

		subject: 'Sending Some Freaking Email', // your email subject (optional but better to have it)
		text: `Hello there my sweetling! Let's send some freaking emails!`, // your email body in plain text format (optional) 

		// your email body in html format (optional)
		// if you want to send a customly and amazingly designed html body
		// instead of a boring plain text, then use this "html" property
		// instead of "text" property
		html: `<h1 style="color: red;text-align:center">Hello there my sweetling!</h1>
					<p style="text-align:center">Let's send some <span style="color: red">freaking</span> emails!</p>`,
	}






	// sending the email
	myTransport.sendMail(mailOptions, (err) => {
		if (err) {
			console.log(`Email is failed to send!`);
			console.error(err);
		} else {
			console.log(`Email is successfully sent!`);
		}
	})
});

app.

// username: team0.clouddrive@gmail.com
// password: ourpassword