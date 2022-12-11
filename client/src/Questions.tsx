import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Profile from './Profile';

export default function Login() {
	const [username, setUsername]: [username: string | undefined, setUsername: (arg: any) => void] = useState<string | undefined>('');
	const [password, setQuestion]: [username: string | undefined, setQuestion: (arg: any) => void] = useState<string | undefined>('');

	// const uid = 
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		console.log(username);
		console.log(password);
		e.preventDefault();
		//axios.defaults.withCredentials = true;
		await axios.post('http://localhost:4003/login', {
			username,
			password
		}, { withCredentials: true });
	};

	<Profile uId={"user0"}/>

	return (<div>
			<h1>Log In</h1>
			<form onSubmit={handleSubmit}>
				<label>Security Question</label>
				<input type="password" onChange={e => setQuestion(e.target.value)} value={password} />
				<div><button type="submit">Submit</button></div>
			</form>
		</div>
	);
}
