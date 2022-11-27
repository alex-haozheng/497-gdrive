import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const onSubmit = async (event) => {
    event.preventDefault(); //?! check doc

    await axios.post('http://localhost:3999/login', {
      username,
      password
    });
  };

  /*

        '<h1>Login Page</h1><form method="POST" action="/login">\
    	Enter Username:<br><input type="text" name="username">\
    	<br>Enter Password:<br><input type="password" name="password">\
    	<br><br><input type="submit" value="Submit"></form>';
    
  */

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label for="username">Username: {username}</label>
          <input
            id="username"
            value={username}
            className="form-control"
          />
          <label for="password">Password: {password}</label>
          <input
            id="password"
            value={password}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Login;