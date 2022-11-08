# Author: 
Yuri Kim

# Github: 
flffamlln

# Service Description: 
Contains information on fileIds (unique key) and their respective tags. These tags are stored in an array and are in String format. This service allows users to add and remove tags to a file given a fileId.

# Interaction with other services: 
- If document deleted, remove document from index.

# Endpoint Information:

## POST tag/:fileId/:work

- Adds a tag to a post using fileId.
- Request:
```
{
	"fileId": "[unique idenitifier]",
	"tag": "[String]"
}
```
- Response:
```
{
	"fileId": "[unique idenitifier]",
	"tags": "[String]"
}
```
- HTTP Status Codes:
    - 200: OK
    - 500: Internal Server Error
---
## DELETE tag/:fileId

- Removes a tag from a file.
- Request:
```
{
	"fileId":"[unique idenitifier]",
	"tag": "[String]"
}
```
- Response:
```
{
	"fileId": "[unique idenitifier]",
	"tags": []
}
```
- HTTP Status Codes:
    - 200: OK
    - 404: Not Found
    - 500: Internal Server Error
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
