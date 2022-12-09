# Author: 
This service's author is Yuri Kim.

# Github: 
This service's author's Github is flffamlln.

# Service:
This service is the profile service.

# Service Description: 
This profile service contains profiles of user accounts. It stores information including userId, email, name, bio and a fun fact. This service can create, read, update and delete profile details of a user given a userId.

# Interaction with other services: 
This profile service interacts with the auth service because it listens for an AccountDeleted event. If it hears one, it removes that user from profile database if the user has a profile because the user's account has been deleted.

# Port #:
This service runs on port 4002.

# Endpoint Information:

## GET /getProfiles 
- Returns all profiles in profiles database.
- Request: 
```
{
}
 ```
 - Response:
 ```
[{
	"uId": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}, ...]
 ```
 - HTTP Status Codes:   
    - 201: [{
	"uId": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}, ...]
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }

---


## GET /getProfile:uId

- Gets a user's profile information.
- Request: 
```
{
	"uId": unique identifier string
}
 ```
 - Response:
 ```
{
	"uId": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}
 ```
 - HTTP Status Codes:   
    - 201: {
	"uId": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}
    - 400: { message: 'BAD REQUEST' }
    - 404: { message: 'User does not have a profile' }
    - 500: { message: 'INTERNAL SERVER ERROR' }

---

## GET /hasProfile:uId

- Returns whether that user has a profile in profiles database.
- Request: 
```
{
	"uId": "[unique identifier string]"
}
 ```
 - Response:
 ```
boolean
 ```
 - HTTP Status Codes:   
    - 201: boolean
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }

--- 
## PUT /updateProfile/:uId:name:email:bio:funFact

- Updates user's profile information using uId.
- Request: 
```
{
	"uId": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}
```
- Response:
```
{ message: 'Profile updated'}
```
- HTTP Status Codes: 
    - 201: { message: 'Profile updated'}
    - 400: { message: 'BAD REQUEST' }
    - 404: { message: 'User does not have a profile' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## POST /addProfile/:uId

- Adds new profile to database for user given uId.
- Request:
```
{
	"uId": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}
```
- Response:
```
{ message: 'Profile added'}
```
- HTTP Status Codes:
    - 201: { message: 'Profile added'}
    - 400: { message: 'BAD REQUEST' }
    - 304: { message: 'User already has a profile' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## DELETE /deleteProfile/:uId

- Deletes a user's profile from database given uId.
- Request:
```
{
	"uId": "[unique identifier string]"
}
```
- Response:
```
{ message: "Deleted profile" }
```
- HTTP Status Codes: 
    - 201: { message: "Deleted profile" }
    - 400: { message: 'BAD REQUEST' }
    - 404: { message: 'Profile does not exist' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## POST /events

- Listens for AccountDeleted event, then when it hears one, deletes that user's profile from profiles database.
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
{ message: "Profile deleted" }
```
- HTTP Status Codes: 
    - 201: { message: "Profile deleted" }
    - 400: { message: 'BAD REQUEST' }
    - 404: { message: 'Profile does not exist' }
    - 500: {message: 'INTERNAL SERVER ERROR'}
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
### **Step 3: Comment out other service running code in docker-compose.yml**

- Uncommented code in docker-compose.yml should just have admin service, event-bus service and mongodbcontainer.

```
version: '3.9'
services:
  profile:
    build: profile
    ports:
      - "4002:4002"
    depends_on:
      - mongodb_container
    environment:
      DATABASE_URL: mongodb://root:rootpassword@mongodb_container:27017/mydb?directConnection=true&authSource=admin
  event-bus:
    build: event-bus
    ports:
      - "4012:4012"
  mongodb_container:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpassword
    volumes:
      - mongodb_data_container:/data/db     
volumes:
  mongodb_data_container:
```

### **Step 4: Run docker-compose up --build**

- Run the application using the `docker-compose up --build` command.

    ```bash
    $ docker-compose up --build
    ```
### **Step 5: Test endpoints with Thunder Client**
- The command from Step 4 will locally host the website on `http://localhost:4002`.
- Exceeds the expectation of this assignment portion: There is a ThunderClient test collection called thunder-collection-profile.json in profile directory. Open this with ThunderClient extension and test endpoints with them.
