# Service:
Admin Access

# Author: 
Yuri Kim

# Github: 
flffamlln

# Service Description: 
Contains information on which users are admins. Thinking of having the Admin service with an array of userIds of users that have admin access.  This service can add and remove admin access of a user given userId. This service allows admins to give a user admin / moderator access. It also allows admins to delete users / posts.

# Interaction with other services: 
If user is deleted, remove userID if in admin list.

# Port #:
Port 4000

# Endpoint Information: 

## POST admin/:userId

- Adds a user as an admin using userId. This should be a POST request.
- Request:
```
{
	"uId": "[unique identifier]"
}
```
- Response:
```
{
	"users": [{JSON USER}]
}
```
- HTTP Status Codes: 
    - 200: OK
    - 500: Internal Server Error
--- 
## DELETE admin/:userId

- Removes a user as an admin using userId. This should be a DELETE request.
- Request: 
```
{
	"users": [{JSON USER}]
}
```
- Response:
```
{
	"users": [{JSON USER}]
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
