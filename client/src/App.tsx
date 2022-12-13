import React, { useEffect, useState } from 'react';
import Login from './Login';
import Admin from './Admin';
import Questions from './Questions';
import ForgotQuestions from './ForgotQuestions';
import LandingPage from './LandingPage';
import Register from './Register';
import Profile from './Profile';
import Analytics from './Analytics';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './Dashboard';

function App() {
  const [uid, setuid]: [uid: string | undefined, setuid: (arg: any) => void] = useState('');
	const [accessToken, setAccessToken]: [accessToken: string | undefined, setAccessToken: (arg: any) => void] = useState('');

  const getuidandToken = (uid1, accessToken1) => {
    setuid(uid1);
    setAccessToken(accessToken1);
  }

  useEffect(() => {
    console.log(`app.tsx2 uid: ${uid}`);
    console.log(`app.tsx2 accessToken: ${accessToken}`);
  }, [uid, accessToken]);
  
  console.log(`app.tsx1 uid: ${uid}`);
  console.log(`app.tsx1 accessToken: ${accessToken}`);



  /* return ( 
    <div className="App">
      <Login func={getuidandToken} />
      <Login func={getuidandToken} />
      <Register />
      <Questions uid = {uid} accessToken = {accessToken} />
      <ForgotQuestions />
      <Profile uid={uid}/>
      <Admin uid={uid}/>
      <ForgotQuestions />
      <Profile uid={uid}/>
      <Admin uid={uid}/>
      <Analytics uid={uid} accessToken={accessToken} />

      <h1>Files</h1>
      <LandingPage /> 
      <EditDocument fileId={'ab03b4c5'}/>
    </div>
  ); */
 
  return (
    <BrowserRouter>
      <Routes>
        {/* unprotected routes */}
        <Route path="/" element={<Login func={getuidandToken} />} />
        <Route path="/register" element={<Register />} />
        {/* protected routes, will only be rendered if the user is logged in */}
        <Route path="/questions" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Questions uid = {localStorage.getItem('uid')} accessToken = {localStorage.getItem('accessToken')} />} </ProtectedRoute>} />
        <Route path="/forgotquestions" element = {<ForgotQuestions />} />
        <Route path="/profile" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Profile uid = {localStorage.getItem('uid')} />} </ProtectedRoute>} />
        <Route path="/admin" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Admin uid = {localStorage.getItem('uid')} />} </ProtectedRoute>} />
        <Route path="/analytics" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Analytics uid = {localStorage.getItem('uid')} accessToken = {localStorage.getItem('accessToken')} />} </ProtectedRoute>} />
        <Route path="/files/*" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<LandingPage />} </ProtectedRoute>} />
        <Route path="/dashboard" element = {<ProtectedRoute uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')}> {<Dashboard uid={localStorage.getItem('uid')} accessToken={localStorage.getItem('accessToken')} />} </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
