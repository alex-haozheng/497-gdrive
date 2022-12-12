# **Authentication Microservice**

## Author: Kays Laouar

## GitHub: kayslaouar

### Port: 4003

# Service:

This service is the Authentication (auth) service.

# Service Description:

This service allows users to register an account, log in and log out, and use authorized-only routes/services. The service also keeps track of whether a user is an admin. The service provides two APIs to other services for restricted access to only authorized users. The service accessTokens. These accessTokens are stored in local storage while a user is logged in. The auth service also directly communicates with all services to authenticate requests. 

# Interaction with other services:

The authentication service sends out an account created event when a user registers and an account deleted event when a user decides to delete their account through the profile service. The authentication service listens for AdminAdded and AdminRemoved events from the admin service and updates the database accordingly. The service also listens for a ChangePassword event from the forgot password service. 

The authentication service also has an endpoint that all other services have direct access to (not through the event-bus). ALL services that need to authenticate users verify their uid and accessToken credentials with the auth service through this endpoint. The auth service provides an API for all services to use as middleware for authenticaiton. 

```javascript
export async function isAuth(req, res, next) {
    const { uid, accessToken }: { uid: string, accessToken: string } = req.body;
    try {
        if (!uid || !accessToken) {
            res.status(400).send('Missing Information');
            return;
        }
        const { dbAccessToken, admin } = (await axios.post('http://auth:4003/authData', { uid })).data;
        if (!dbAccessToken) {
            res.status(400).send('User Does Not Exist');
        } else if (accessToken !== dbAccessToken) {
            res.status(400).send('Unauthorized Access');
        } else {
            next();
        }
    } catch(e) {
        console.log(e);
    }
}
```

Example Usage: (isAuth function used as middleware)

```javascript
app.httpmethod('/endpoint', isAuth, async (req, res) => {
	console.log('Passed Authentication! Reached Endpoint!')
}
```

-   `POST /login`
    -   Description: logs the user into the application.
    -   Request: 
```json
{
	"uid": "kays",
	"password": "****"
}
```
	-   Response:
```json
{
	"uid": "kays",
	"accessToken": "f9981f8fd472f2e8028eee6b8200f2088bbbb34b5a203d2d42e45b3588725f75"
}
```

-   `POST /register`
    -   Description: logs the user into the application.
    -   Request:
```json
{
	"uid": kays,
	"email": kays@email.com,
	"password": ****
}
```
	-   Response: None

-   `POST /unregister`
    -   Description: logs the user into the application.
    -   Request:
```json
{
	"uid": kays
}
```
	-   Response: None

-   `POST /authData`
    -   Description: logs the user into the application.
    -   Request:
```json
{
	"uid": "kays",
	"accessToken": "f9981f8fd472f2e8028eee6b8200f2088bbbb34b5a203d2d42e45b3588725f75"
}
```
	-   Response: None
```json
{
	"dbAccessToken": "f9981f8fd472f2e8028eee6b8200f2088bbbb34b5a203d2d42e45b3588725f75",
	"admin": "true",
}
```

# How to run service:

### **Step 1: Prerequisites**

-   [Node](https://nodejs.org/en/)
-   [NPM](https://www.npmjs.com/)
-   [VSCode](https://code.visualstudio.com/)
    -   Install the appropriate language support for each language used in the project.
-   [React.js](https://reactjs.org/)
-   [Git](https://git-scm.com/)
-   [Express.js](https://expressjs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [Docker](https://www.docker.com/)
-   [Kubernetes](https://kubernetes.io/)

### **Step 2: Clone the Repository**

-   Navigate to the desired project directory on your computer.

-   Clone the repository from [GitHub](https://github.com/umass-cs-497s-F22/milestone-2-implementation-team0.git) using the `git clone` command.

```bash
$ git clone https://github.com/umass-cs-497s-F22/milestone-2-implementation-team0.git
```

-   Navigate to the cloned repository directory.

```bash
$ cd name-of-cloned-repository
```

### **Step 3: Comment out other service running code in docker-compose.yml**

-   Uncommented code in docker-compose.yml should just have admin service, event-bus service and mongodbcontainer.

```
version: '3.9'
services:
  auth:
    build: auth
    ports:
      - "4003:4003"
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

-   Run the application using the `docker compose up --build` command.

```bash
$ docker compose up --build
```

### **Step 5: Test endpoints with Thunder Client**

-   The command from Step 4 will locally host the website on `http://localhost:4003`.
-   There is a ThunderClient test collection called thunder-collection-admin.json in admin directory. Open this with ThunderClient extension and test endpoints with them.
