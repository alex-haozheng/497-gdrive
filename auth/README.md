# **Authentication Microservice**

## Author: Kays Laouar

## GitHub: kayslaouar

### Port: 4003

# Service:

This service is the Authentication (auth) service.

# Service Description:

This service allows users to register an account, log in and log out, and use authorized-only routes/services. The service also keeps track of whether a user is an admin. The service provides two APIs to other services for restricted access to only authorized users. The service uses passport js, local strategy, and creates a session for the user to stay logged in.

# Interaction with other services:

The authentication service sends out an account created event when a user registers and an account deleted event when a user decides to delete their account through the profile service. The authentication service listens for AdminAdded and AdminRemoved events from the admin service and updates the database accordingly. The service also listens for a ChangePassword event from the forgot password service.

-   `POST /login`
    -   Description: logs the user into the application.
    -   Request: 
```json
{
	"username": "kays",
	"password": "****"
}
```
	-   Response:
```html
<html>
	<h3>Success!</h3>
    <br />
	<a href="/auth-route">Go to authorized-only route</a>
	<br />
	<a href="/auth-route">Go to admin-only route</a>
</html>
```

-   `GET /login`
    -   Description: delivers static HTML login page
    -   Request: None
	-   Response:
```html
<html>
	<h1>Log In</h1>
	<form method="POST" action="/login">
		<br />Enter Username:<br />
		<input type="text" name="username" />
		<br />Enter Password:<br />
		<input type="password" name="password" />
		<br />
		<input type="submit" value="Submit" />
        <br />
        <a href="/register">register</a>
	</form>
</html>
```

-   `POST /register`
    -   Description: logs the user into the application.
    -   Request:
```json
{
	"username": kays,
	"email": kays@email.com,
	"password": ****
}
```
	-   Response: 
```html
<html>
	<h1>Log In</h1>
	<form method="POST" action="/login">
		<br />Enter Username:<br />
		<input type="text" name="username" />
		<br />Enter Password:<br />
		<input type="password" name="password" />
		<br />
		<input type="submit" value="Submit" />
        <br />
        <a href="/register">register</a>
	</form>
</html>
```

-   `GET /register`
    -   Description: logs the user into the application.
    -   Request: None
	-   Response: 
```html
<html>
	<h1>Register</h1>
	<form method="POST" action="/register">
		<br />Enter Username:<br />
		<input type="text" name="username" />
		<br />Enter Email:<br />
		<input type="text" name="email" />
		<br />Enter Password:<br />
		<input type="password" name="password" />
		<br />
		<input type="submit" value="Submit" />
        <br />
        <a href="/login">login</a>
	</form>
</html>
```

-   `POST /unregister`
    -   Description: logs the user into the application.
    -   Request:
```json
{
	"username": kays
}
```
	-   Response: 
```html
<html>
	<h1>Log In</h1>
	<form method="POST" action="/login">
		<br />Enter Username:<br />
		<input type="text" name="username" />
		<br />Enter Password:<br />
		<input type="password" name="password" />
		<br />
		<input type="submit" value="Submit" />
        <br />
        <a href="/register">register</a>
	</form>
</html>
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
