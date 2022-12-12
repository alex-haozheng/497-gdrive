import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Questions({uid, accessToken}) {
	// const [username, setUsername]: [username: string | undefined, setUsername: (arg: any) => void] = useState<string | undefined>('');
	const [question, setQuestion]: [question: string | undefined, setQuestion: (arg: any) => void] = useState<string | undefined>('');

	// const uid = 'test';
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		console.log(uid);
		console.log(`accesToken inside Questions.tsx: ${accessToken}`);
		e.preventDefault();
		//axios.defaults.withCredentials = true;
		await axios.post('http://localhost:4006/new/user', {
			uid,
			accessToken,
			question
		});
	};

	return (<div>
			<h1>Security Question</h1>
			<form onSubmit={handleSubmit}>
				<label>Security Question</label>
				<input type="question" onChange={e => setQuestion(e.target.value)} value={question} />
				<div><button type="submit">Submit</button></div>
			</form>
		</div>
	);
}
