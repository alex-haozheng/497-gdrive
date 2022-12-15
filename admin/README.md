# Author: 
This service's author is Yuri Kim.

# Github: 
This service's author's Github is flffamlln.

# Service:
This service is the admin service.

# Service Description: 
This admin service contains which users are admins. It has endpoints to give a user admin access, remove admin access from a user, check if a user has admin access, removing a user from admin db if a user has been deleted and more. Admins have abilities to give other users admin access as well as remove admin access from users.

# Interaction with other services: 
This admin service listens for an AccountDeleted event. If it hears one, it removes that user from admin database if the user is in admin database because the user's account has been deleted.

# Port #:
This service runs on port 4000.

# Endpoint Information: 
## POST /events

- This endpoint listens for a user deleted event message. If a user's account has been deleted, it removes user from admins database if it is there.
- Request: 
```
{
	"type": "AccountDeleted",
    "data": {
        "uId": "[unique identifier string]"
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
    - 201: { message: "Removed user's admin access" }
    - 304: { message: 'User is not an admin' }
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## GET /checkAdmin/:uId

- Returns whether a specific user is an admin or not.
- Request: 
```
{
        "uId": "[unique identifier string]"
}
```
- Response:
```
"[boolean value]"
```
- HTTP Status Codes: 
    - 201: "[boolean value]"
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## GET /getAdmins

- Returns all users that are admins.
- Request: 
```
{
    
}
```
- Response:
```
"[array of unique identifier Strings]"
```
- HTTP Status Codes: 
    - 201: "[array of unique identifier Strings]"
    - 400: { message: 'BAD REQUEST' }
    - 500: Internal Server Error
---
## POST /addAdmin

- Adds a user as an admin using uId.
- Request:
```
{
  "uId": "[unique identifier string]"
}
```
- Response:
```
{
	"message": "User added as an admin"
}
```
- HTTP Status Codes: 
    - 201: { message: 'User added as an admin'}
    - 304: { message: 'User is already an admin' }
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
--- 
## DELETE /removeAdmin/:userId

- Removes a user as an admin using userId.
- Request: 
```
{
  "uId": "[unique identifier string]"
}
```
- Response:
```
{
	"message": "Removed user's admin access"
}
```
- HTTP Status Codes:
    - 201: { message: "Removed user's admin access" }
    - 400: { message: 'BAD REQUEST' }
    - 304: { message: 'User is not an admin' }
    - 500: { message: 'INTERNAL SERVER ERROR' }

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

### **Step 3: Run docker-compose up --build**

- Run the application using the `docker-compose up --build` command.

    ```bash
    $ docker-compose up --build
    ```
- The command will locally host the website on `http://localhost:3000`.

### **Exceeds expectation of this assignment**
- Included a ThunderClient test collection called thunder-collection-admin.json in admin directory for testing of endpoints
- Added details of status codes sent for endpoints
- Have four services and expanded 2 react components to include many calls to backend services
