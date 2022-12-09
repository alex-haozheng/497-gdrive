# **Moderator Microservice**

## Author: Kays Laouar

## GitHub: kayslaouar

### Port: 4005

# Service:

This service is the Moderator (moderator) service.

# Service Description: 
The moderator service scans all files in the system for any blacklisted words. Uses edit distance dp algorithm to determine if a word is too similar to a blacklisted word. Adds the suspicious file to a database that admins can access through the analytics service. 

# Interaction with other services: 
Every time a file is added, the file service sends a FileUpdated event that this moderator service listens for to scan the document for blacklisted words.

# Endpoint Information: 

This service has no client facing endpoints. It operates entirely behind the scences and asynchrously and only listens for events from the event bus. More details about these events are found above or in the event-bus README.

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
  moderator:
    build: moderator
    ports:
      - "4005:4005"
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

-   The command from Step 4 will locally host the website on `http://localhost:4005`.
-   There is a ThunderClient test collection called thunder-collection-admin.json in admin directory. Open this with ThunderClient extension and test endpoints with them.
