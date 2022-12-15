# Author: 
This service's author is Yuri Kim.

# Github: 
This service's author's Github is flffamlln.

# Service:
This service is the profile service.

# Service Description: 
This profile service contains profiles of users. It stores information including uid, email, name, bio and a fun fact. This service can get profiles of all profiles in database, get a profile details of a specific uid, check if a specific user has a profile stored in database, update a specific user's profile details, create a profile, delete a profile and delete a profile when the associated uid's account is deleted.

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
"[{
	"uid": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}, ...]"
 ```
 - HTTP Status Codes:   
    - 201: "[{
	"uid": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}, ...]"
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }

---


## GET /getProfile/:uid

- Gets a user's profile information.
- Request: 
```
{
	"uid": "[unique identifier string]"
}
 ```
 - Response:
 ```
{
	"uid": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}
 ```
 - HTTP Status Codes:   
    - 201: {
	"uid": "[unique identifier string]",
    "name": "[string]",
    "email": "[unicode 64 characters max]",
    "bio": "[String]",
    "funFact": "[String]"
}
    - 400: { message: 'BAD REQUEST' }
    - 404: { message: 'User does not have a profile' }
    - 500: { message: 'INTERNAL SERVER ERROR' }

---

## GET /hasProfile/:uid

- Returns whether that user has a profile in profiles database.
- Request: 
```
{
	"uid": "[unique identifier string]"
}
 ```
 - Response:
 ```
"[boolean]"
 ```
 - HTTP Status Codes:   
    - 201: "[boolean]"
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }

--- 
## PUT /updateProfile/:uid/:name/:email/:bio/:funFact

- Updates user's profile information using uid.
- Request: 
```
{
	"uid": "[unique identifier string]",
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
## POST /addProfile/:uid/:name/:email/:bio/:funFact

- Adds new profile to database for user given uid.
- Request:
```
{
	"uid": "[unique identifier string]",
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
## DELETE /deleteProfile/:uid

- Deletes a user's profile from database given uid.
- Request:
```
{
	"uid": "[unique identifier string]"
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
        "uid": "[unique identifier string]"
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

### **Step 3: Run docker-compose up --build**

- Run the application using the `docker-compose up --build` command.

    ```bash
    $ docker-compose up --build
    ```

### **Exceeds expectation of this assignment**
- Included a ThunderClient test collection called thunder-collection-profile.json in profile directory for testing of endpoints
- Added details of status codes sent for endpoints
- Have four services and expanded 2 react components to include many calls to backend services
