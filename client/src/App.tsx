import React, { useEffect, useState } from 'react';
import Login from './Login';
import Admin from './Admin';
import Questions from './Questions';
import ForgotQuestions from './ForgotQuestions';
import LandingPage from './LandingPage';
import Register from './Register';
import Profile from './Profile';
import EditDocument from './EditDocument';
import Analytics from './Analytics';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [uid, setuid]: [uid: string | undefined, setuid: (arg: any) => void] = useState('');
	const [accessToken, setAccessToken]: [accessToken: string | undefined, setAccessToken: (arg: any) => void] = useState('');

  const getUIDandToken = (uid1, accessToken1) => {
    setuid(uid1);
    setAccessToken(accessToken1);
  }

  useEffect(() => {
    console.log(`app.tsx2 uid: ${uid}`);
    console.log(`app.tsx2 accessToken: ${accessToken}`);
  }, [uid, accessToken]);
  
  console.log(`app.tsx1 uid: ${uid}`);
  console.log(`app.tsx1 accessToken: ${accessToken}`);


  /*
  return (
    <div className="App">
      <Login func={getUIDandToken} />
      <Register />
      <Questions uid = {uid} accessToken = {accessToken} />
      <ForgotQuestions uid = {uid} accessToken = {accessToken} />
      <Profile uid = {uid} accessToken = {accessToken} />
      <Admin uid = {uid} accessToken = {accessToken} />
      <Questions uid = {uid} accessToken = {accessToken}/>
      <ForgotQuestions uid = {uid} accessToken = {accessToken}/>
      <Profile uid={uid} accessToken = {accessToken}/>
      <Admin uid={uid} accessToken = {accessToken}/>
      <Analytics uid={uid} accessToken={accessToken} />

      <h1>Files</h1>
      <LandingPage /> 
      <EditDocument fileId={'ab03b4c5'}/>
    </div>
  );
  */
  return (
    <BrowserRouter>
      <Routes>
        {/* unprotected routes */}
        <Route path="/" element={<Login func={getUIDandToken} />} />
        <Route path="/register" element={<Register />} />
        {/* protected routes, will only be rendered if the user is logged in */}
        <Route path="/questions" element = {<ProtectedRoute uid={uid} accessToken={accessToken}> {<Questions uid = {uid} accessToken = {accessToken} />} </ProtectedRoute>} />
        <Route path="/forgotquestions" element = {<ProtectedRoute uid={uid} accessToken={accessToken}> {<ForgotQuestions uid = {uid} accessToken = {accessToken} />} </ProtectedRoute>} />
        <Route path="/profile" element = {<ProtectedRoute uid={uid} accessToken={accessToken}> {<Profile uid = {uid} accessToken = {accessToken} />} </ProtectedRoute>} />
        <Route path="/admin" element = {<ProtectedRoute uid={uid} accessToken={accessToken}> {<Admin uid = {uid} accessToken = {accessToken} />} </ProtectedRoute>} />
        <Route path="/analytics" element = {<ProtectedRoute uid={uid} accessToken={accessToken}> {<Analytics uid = {uid} accessToken = {accessToken} />} </ProtectedRoute>} />
        <Route path="/files" element = {<ProtectedRoute uid={uid} accessToken={accessToken}> {<LandingPage />} </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
