# Author: 
Yuri Kim

# Github: 
flffamlln

# Service Description: 

Contains information on a user including userId (unique key), email, password, name and misc. information such as a user’s status / bio. This service can create, read, update and delete profile details of a user given a userId.

# Interaction with other services: 

- If user deleted, remove their profile.

- If password updated, update password in profile.

# Endpoint Information:

## GET /profile/:userId

- Gets profile details by userId.
- Request: 
```
{
	"uId": "[unique identifier]"
}
 ```
 - Response:
 ```
{
    "uId": "[unique identifier]",
    "email" : "[unicode 64 characters max]",
    "password": "[unicode 64 characters max]",
    "name": "[String]",
}
 ```
 - HTTP Status Codes:   
    - 200: OK
    - 404: Not Found
    - 500: Internal Server Error

---
## PUT /profile/:userId

- Updates a profile details by userId.
- Request: 
```
{
	"uId": "[unique identifier]"
}
```
- Response:
```
{
    "uId": "[unique identifier]",
    "email" : "[unicode 64 characters max]",
    "password": "[unicode 64 characters max]",
    "name": "[String]",
}
```
- HTTP Status Codes: 
    - 200: OK
    - 304: Not Modified
    - 404: Not Found
    - 500: Internal Server Error
---
## POST /profile/:userId

- Creates a profile details by userId.
- Request:
```
{
	"uId": "[unique identifier]"
}
```
- Response:
```
{
    "uId": "[unique identifier]",
    "email" : "[unicode 64 characters max]",
    "password": "[unicode 64 characters max]",
    "name": "[String]",
}
```
- HTTP Status Codes:
    - 200: OK
    - 500: Internal Server Error
---
## DELETE /profile/:userId

- Creates a profile details by userId.
- Request:
```
{
	"uId": "[unique identifier]"
}
```
- Response:
```
{
    "uId": "[unique identifier]",
    "email" : "[unicode 64 characters max]",
    "password": "[unicode 64 characters max]",
    "name": "[String]",
}
```
- HTTP Status Codes: 
    - 200: OK
    - 404: Not Found
    - 500: Internal Server Error
---
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
