import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Register() {
	const [username, setUsername]: [username: string | undefined, setUsername: (arg: any) => void] = useState<string | undefined>('');
    const [email, setEmail]: [email: string | undefined, setEmail: (arg: any) => void] = useState<string | undefined>('');
	const [password, setPassword]: [username: string | undefined, setPassword: (arg: any) => void] = useState<string | undefined>('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await axios.post('http://auth:4003/login', {
			username,
            email,
			password
		});
        setUsername(''), setPassword('');
	};

	return (
		<div>
			<h1>Log In</h1>
			<form onSubmit={handleSubmit}>
				<label>Username</label>
				<input type="text" onChange={e => setUsername(e.target.value)} />
                <label>Email</label>
				<input type="text" onChange={e => setEmail(e.target.value)} />
				<label>Password</label>
				<input type="password" onChange={e => setPassword(e.target.value)} />
				<div><button type="submit">Submit</button></div>
			</form>
		</div>
	);
}