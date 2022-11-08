# Author: 
Alex Zheng

# Github: 
sazzle2

# Service Description: 
This service will handle the event in which a user loses their account information via password, the plan is to allow users to use a one time password then allow them to change their old password, basically trying to imitate the process online when a user forgets their password. Users will enter the email through the UI, and receive an email with their one time password to login

# Interaction with other services: 
will send events to the users endpoint to change the change password flag or something so that users are forced to change their password before continuing. In addition, they will send a change password event to the users endpoint

# Endpoint Information: 

`GET /login/:email/forgotpw`

Description: This endpoint will send an email out to the recipients with the following account information

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
