# Service:
This is our client (front-end) service.

# Authors + Githubs:
The authors and Githubs of this service are: 

Yuri Kim (flffamlln) 

Alex Zheng (sazzle2)

Kays Laouar (kayslaouar)

Justin Baltazar (justinmbaltazar)


# Service Description: 
Client is a front-end service that has UI components and talks to our other services to retrieve information and complete user actions.

Admin UI will allow adding of an admin and removing of an admin.

Profile UI will allow viewing a user's profile details and editing parts of a user's profile details.

The Forgot Password UI will allow the client to access the questions endpoint.

The File Compression UI will allow the client to download files onto their local machine.

Auth UI will allow people to register/login/out.

Analytics UI will allow admins to see aggregate data about all files in the app.

# Interaction with other services: 
Client service interacts with other services to create UI components. For example:

Admin UI interacts with admin service to show who are admins and who are not admins. It also has children components to add admins / remove admins and view admin requests.

Profile UI interacts with profile service to show user's profile details and allows editing a user's profile details.

FileCompression UI interacts with the file service to update the status (opened / closed) of current selected files.

Questions UI interacts with the authentication service as it changes the password on the database followed by an email. 

Auth UI interacts with auth service (sends it username, email, password for registration, username password for login).

Analytics UI interacts with analytics service. Displays analytics that service provides.

# Port #:
This service runs on port 3000.


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

### **Step 3: Run the Application**

```bash
$ docker compose up --build
```

### **Step 5: View the Application**
- The command will locally host the website on `http://localhost:3000`.
