import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ForgotQuestions() {
	const [uid, setuid]: [uid: string | undefined, setuid: (arg: any) => void] = useState<string | undefined>('');
	const [question, setQuestion]: [question: string | undefined, setQuestion: (arg: any) => void] = useState<string | undefined>('');
	const [otp, setotp]: [otp: string | undefined, setotp: (arg: any) => void] = useState<string | undefined>('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		console.log(uid);
		console.log(otp);
		e.preventDefault();
		await axios.post('http://localhost:4006/verify', {
			uid,
			question,
			otp
		});
	};

	return (<div>
			<h1>Forgot Question</h1>
			<form onSubmit={handleSubmit}>
				<label>Username</label>
				<input type="uid" onChange={e => setuid(e.target.value)} value={uid} />
				<label>Security Question</label>
				<input type="question" onChange={e => setQuestion(e.target.value)} value={question} />
				<label>New Password</label>
				<input type="otp" onChange={e => setotp(e.target.value)} value={otp} />
				<div><button type="submit" >Submit</button></div>
			</form>
			<button onClick={() => window.location.href = "/"}>Login Page</button>
		</div>
	);
}
