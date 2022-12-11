import React from 'react';
import Login from './Login';
import AdminList from './AdminList';
import LandingPage from './LandingPage';

function App() {
  return (
    <div className="App">
      <h1>Login</h1>
      <Login />
      <h1>Admin</h1>
      <AdminList />
      <h1>Files</h1>
      
      {/* uncomment the line below to see a working concept of the landing page where all the files are shown on. Only works when fileService and uploadDownload service are running.
      <LandingPage />
      */}
    </div>
  );
}

export default App;
