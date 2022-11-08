# Author: 
Alex Zheng

# Github: 
sazzle2

# Service Description: 
This service will behave as a query service to scale query requests within our application. 

# Interaction with other services: 
Listens to majority of events that have a post or change within the database. The whole point is to update and keep a copy of that inside this endpoints resulting in fast query responses

# Endpoint Information: 

`POST /event`

Description: Listens to all the events (userCreation, userDeletion, adminCreation, adminDeletion, fileCreation, fileDeletion)

`GET /users/list`

Description: Returns a list of all the users

`GET user/:uid/files`

Description: Returns a list of all files under that uid

`GET user/:uid/files/:keyword/search`

Description: Returns a list of files that contains the keyword

- will add endpoints as I go

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
