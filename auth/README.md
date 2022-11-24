# Author: 
Kays Laouar

# Github: 
kayslaouar

# Service Description: 
This service handles user authentication. We may combine different tiers of access (admin/user) into an authorization service that affects what users have access to/what UI components they see based on what tier they are in. Authentication will allow users to access their files, and ensure that the identity trying to access the account is truly the account owner (by using username/password, passport.js). May use authentication token for privileged operations in interacting with other services. May use cookies/local storage to keep track of who is logged in.

# Interaction with other services: 
Authentication service gets notified by event bus when settings are changed. If username, password, or 2FA credentials are changed, Authentication service is notified and updates internal data accordingly. Privileged operations are unlocked in higher tiers, and this affects the UI and API access. For example, deleting files is a privileged operation reserved for admin. A basic  tier user won’t see a UI component for deleting files, and they won’t have access to the API either.

# Endpoint Information: 

## POST /login
- login to account
- request: 
```json
{
	username: "abcde",
	password: "*****"
}
```

## POST /logout
- logout of account

## POST /signup
- create an account
- request: 
```json
{
	username: "abcde",
	password: "*****"
}
```

# How to run service:

### **Step 1: Prerequisites**

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [VSCode](https://code.visualstudio.com/)
    - Install the appropriate language support for each language used in the project.
- [React.js](https://reactjs.org/)
- [Git](https://git-scm.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)

### **Step 2: Clone the Repository**

- Navigate to the desired project directory on your computer.
- Clone the repository from [GitHub](https://github.com/umass-cs-497s-F22/milestone-2-implementation-team0.git) using the `git clone` command.
```bash
$ git clone https://github.com/umass-cs-497s-F22/milestone-2-implementation-team0.git
```
- Navigate to the cloned repository directory.
```bash
$ cd name-of-cloned-repository
```

### **Step 3: Install Dependencies**

- Check that the terminal is in the correct directory.
```bash
$ pwd
```
- Install the dependencies using the `npm install` command.
```bash
$ npm install
```

### **Step 4: Run the Application**

- Run the application using the `npm start` command.
```bash
$ npm start
```
### **Step 5: View the Application**
- The command from Step 4 will locally host the website on `http://localhost:3000`.