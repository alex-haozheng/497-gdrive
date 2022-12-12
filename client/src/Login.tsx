import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Login({ func }) {
	const [uid, setuid]: [uid: string | undefined, setuid: (arg: any) => void] = useState<string | undefined>('');
	const [password, setPassword]: [password: string | undefined, setPassword: (arg: any) => void] = useState<string | undefined>('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		console.log(uid);
		console.log(password);
		e.preventDefault();
		//axios.defaults.withCredentials = true;
		const accessToken = (await axios.post('http://localhost:4003/login', {
			uid,
			password
		})).data.accessToken;
		console.log(accessToken);
		func(uid, accessToken);
        /* setuid(''), setPassword(''); */
	};

	return (<div>
			<h1>Log In</h1>
			<form onSubmit={handleSubmit}>
				<label>uid</label>
				<input type="text" onChange={e => setuid(e.target.value)} value={uid} />
				<label>Password</label>
				<input type="password" onChange={e => setPassword(e.target.value)} value={password} />
				<div><button type="submit">Submit</button></div>
			</form>
			<button onClick={e => func('', '')} value={uid} >Log Out</button>
		</div>
	);
}
