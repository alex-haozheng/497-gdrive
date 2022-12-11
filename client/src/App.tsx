import React from 'react';
import Login from './Login';
import AdminList from './AdminList';

function App() {
  return (
    <div className="App">
      <h1>Login</h1>
      <Login />
      <h1>Admin</h1>
      <AdminList />
    </div>
  );
}

export default App;
