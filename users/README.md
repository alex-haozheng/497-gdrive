# Author: 
Kays Laouar

# Github: 
kayslaouar

# Service Description: 
service for handling user information. Handles database queries for users. Only admins can interact with some user service API’s like getting all users, so these API’s check for admin authorization. 

# Interaction with other services: 
Listens for communication from event bus. Updates user data if users change it. Also, admins can see overall user data across whole platform and can see people’s files and delete bad content. Admin send event-bus comms, and users services listen for these communications to send over all user data, update data, etc.

# Endpoint Information: 

## GET /users
- admin request to get all users
- response: 
```json
[
	{
		username: "gjier"
	}
]
```

## GET /users/:userId

## POST /user/create
- create a new user
- request: 
```json
{
	username: "gjier",
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