import React from 'react';
import Login from './Login';
import AdminList from './AdminList';
import AdminRequests from './AdminRequests';
import Questions from './Questions';
import ForgotQuestions from './ForgotQuestions';
import LandingPage from './LandingPage';
import Register from './Register';
import Profile from './Profile';
import EditDocument from './EditDocument';

function App() {
  return (
    <div className="App">
      <Login />
      <Register />
      <Profile uId={"user0"}/>
      <AdminList />
      <AdminRequests />
      <Questions uId = {'test'}/>
      <ForgotQuestions uId = {'test'}/>

      <h1>Files</h1>
      {/* uncomment the line below to see a working concept of the landing page where all the files are shown on. Only works when fileService and uploadDownload service are running.} */}
      {/*<LandingPage /> */}
    </div>
  );
}

export default App;
