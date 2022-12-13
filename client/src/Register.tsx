import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Register() {
	const [uid, setuid]: [uid: string | undefined, setuid: (arg: any) => void] = useState<string | undefined>('');
    const [email, setEmail]: [email: string | undefined, setEmail: (arg: any) => void] = useState<string | undefined>('');
	const [password, setPassword]: [uid: string | undefined, setPassword: (arg: any) => void] = useState<string | undefined>('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await axios.post('http://localhost:4003/register', {
			uid,
            email,
			password
		});
        /* setuid(''), setPassword(''); */
	};

	return (
		<div>
			<h1>Register</h1>
			<form onSubmit={handleSubmit}>
				<label>uid</label>
				<input type="text" onChange={e => setuid(e.target.value)} value={uid} />
                <label>Email</label>
				<input type="text" onChange={e => setEmail(e.target.value)} value={email} />
				<label>Password</label>
				<input type="password" onChange={e => setPassword(e.target.value)} value={password} />
				<div><button type="submit">Submit</button></div>
			</form>
			<button onClick={() => window.location.href = '/questions'} value={uid} >Security Questions</button>
			<button onClick={() => window.location.href = '/login'} value={uid} >Login</button>
		</div>
	);
}