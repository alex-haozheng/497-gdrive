# Author: 
Kays Laouar

# Github: 
kayslaouar

# Service Description: 
Service scans all documents added to the system for any blacklisted words. 
Uses edit distance dp algorithm to determine if a word is too similar to a blacklisted word.

# Interaction with other services: 
Listens for communication from event bus. Event type "adminanalytics". displays data on browser.

# Endpoint Information: 

## POST /blacklist/add/:word
- adds a word to the blacklist

## DELETE /blacklist/remove/:word
- removes a word from the blacklist

## PUT /blacklist/update/threshold
- update threshold of what is too similar to a blacklisted word. If distance is below threshold, words are too similar and word gets blacklisted. Admins can update the threshold if its too harsh or not catching enough bad words
- request:
```json
{
	"threshold": 0.5
}
```

## POST /events
- listens for FileCreated and FileUpdated events from the event bus. Sends FileModerated event with status
- request: 
```json
{
	"type": "FileCreated" | "FileUpdated",
	"data": {
		"id": "123",
		"content": "hola",
		"postId": "456"
	}
}
```
- response:
```json
{
	"type": "FileModerated",
	"data": {
		"id": "123",
		"content": "hola",
		"postId": "456",
        "status": "accepted" | "rejected"
	}
}

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