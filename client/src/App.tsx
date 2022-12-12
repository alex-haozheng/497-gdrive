import React, { useEffect, useState } from 'react';
import Login from './Login';
import Admin from './Admin';
import Questions from './Questions';
import ForgotQuestions from './ForgotQuestions';
import LandingPage from './LandingPage';
import Register from './Register';
import Profile from './Profile';
import EditDocument from './EditDocument';

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

      <h1>Files</h1>
      {/* uncomment the line below to see a working concept of the landing page where all the files are shown on. Only works when fileService and uploadDownload service are running.} */}
      <LandingPage /> 
      <EditDocument fileId={'ab03b4c5'}/>
    </div>
  );
}

export default App;
