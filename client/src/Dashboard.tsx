import React from 'react';

export default function Dashboard({ uid, accessToken }) {
	return (
		<div>
			<button onClick={() => (window.location.href = '/files/*')} value={uid}>
				Files
			</button>
			<button onClick={() => (window.location.href = '/profile')} value={uid}>
				Profile
			</button>
			<button onClick={() => (window.location.href = '/admin')} value={uid}>
				Admin
			</button>
			<button onClick={() => (window.location.href = '/analytics')} value={uid}>
				Analytics
			</button>
		</div>
	);
}

/* <Route path="/questions" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Questions uid = {localStorage.getItem('uid')} accessToken = {localStorage.getItem('accessToken')} />} </ProtectedRoute>} />
        <Route path="/forgotquestions" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<ForgotQuestions />} </ProtectedRoute>} />
        <Route path="/profile" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Profile uid = {localStorage.getItem('uid')} />} </ProtectedRoute>} />
        <Route path="/admin" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Admin uid = {localStorage.getItem('uid')} />} </ProtectedRoute>} />
        <Route path="/analytics" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Analytics uid = {localStorage.getItem('uid')} accessToken = {localStorage.getItem('accessToken')} />} </ProtectedRoute>} />
        <Route path="/files/*" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<LandingPage />} </ProtectedRoute>} /> */
