# Service:
This service is the admin service.

# Author: 
This service's author is Yuri Kim.

# Github: 
This service's author's Github is flffamlln.

# Service Description: 
This admin service contains which users are admins. It has endpoints to give a user admin access, remove admin access from a user, check if a user has admin access, removing a user from admin db if a user has been deleted and more. Admins have the abilities including changing admin access for other users,

# Interaction with other services: 
This admin service listens for an AccountDeleted event. If it hears one, it removes that user from admin database if the user is in admin database because the user's account has been deleted.

# Port #:
This service runs on port 4000.

# Endpoint Information: 
## POST events

- This endpoint listens for a user deleted event message. If a user's account has been deleted, it removes user from admins database if it is there.
- Request: 
```
{
	"type": "AccountDeleted",
    "data": {
        "uId": "[unique identifier]"
    }
}
```
- Response:
```
{
	"message": "Removed user's admin access"
}
```
- HTTP Status Codes: 
    - 201: OK
    - 400: BAD REQUEST
    - 404: USER NOT FOUND IN ADMINS DB
    - 500: Internal Server Error
---
## GET admin:uId

- Returns whether a specific user is an admin or not.
- Request: 
```
{
    "uId": "[unique identifier]"
}
```
- Response:
```
{
	"data": [boolean value]
}
```
- HTTP Status Codes: 
    - 201: OK
    - 400: BAD REQUEST
    - 500: Internal Server Error
---
## GET admin/all

- Returns all users that are admins.
- Request: 
```
{
    
}
```
- Response:
```
{
	"data": [array of unique identifiers]
}
```
- HTTP Status Codes: 
    - 201: OK
    - 400: BAD REQUEST
    - 500: Internal Server Error
---
## POST admin/:uId

- Adds a user as an admin using uId.
- Request:
```
{
	"uId": "[unique identifier]"
}
```
- Response:
```
{
	"message": "User added as an admin"
}
```
- HTTP Status Codes: 
    - 201: OK
    - 400: BAD REQUEST
    - 404: User is already an admin
    - 500: Internal Server Error
--- 
## DELETE admin/:userId

- Removes a user as an admin using userId.
- Request: 
```
{
	"uId": "[unique identifier]"
}
```
- Response:
```
{
	"message": "Removed user's admin access"
}
```
- HTTP Status Codes:
    - 201: OK
    - 400: BAD REQUEST
    - 404: USER NOT FOUND IN ADMIN DB
    - 500: INTERNAL SERVER ERROR

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
