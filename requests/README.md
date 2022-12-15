# Author: 
This service's author is Yuri Kim.

# Github: 
This service's author's Github is flffamlln.

# Service:
This service is the requests service.

# Service Description: 
This requests service contains which users have requested admin access. It has endpoints to add a request, get uids that have current admin access requests, checking if a user has an admin access request and removing a request.

# Interaction with other services: 
This service does not interact with other services.

# Port #:
This service runs on port 4013.

# Endpoint Information: 
## GET /checkRequest/:uid

- Returns whether a specific user is has an actie request or not.
- Request: 
```
{
        "uid": "[unique identifier string]"
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
## GET /getRequests

- Returns all users that have active requests.
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
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## POST /addRequest

- Adds a user as an admin using uid.
- Request:
```
{
  "uid": "[unique identifier string]"
}
```
- Response:
```
{ message: 'Request submitted'}
```
- HTTP Status Codes: 
    - 201: { message: 'Request submitted'}
    - 304: { message: 'User has already submitted a pending request for admin access' }
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
--- 
## DELETE /removeRequest/:uid

- Removes a user as an admin using uid.
- Request: 
```
{
  "uid": "[unique identifier string]"
}
```
- Response:
```
{
	"message": "Removed user's admin access"
}
```
- HTTP Status Codes:
    - 201: { message: "Removed request for admin access" }
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

### **Exceeds expectation of this assignment**
- Included a ThunderClient test collection called thunder-collection-requests.json in profile directory for testing of endpoints
- Added details of status codes sent for endpoints
- Have four services and expanded 2 react components to include many calls to backend services
