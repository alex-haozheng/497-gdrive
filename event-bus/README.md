# Service:
Event bus

# Authors + Githubs: 
Yuri Kim (flffamlln) 

# Service Description: 
Contains message receiving and sending to all services with event message types declared and documented. 

# Interaction with other services: 
Event bus interacts with other services by relaying event messages it receives so other services can react to these event messages as necessary.

# Port #:
Port 4012

# Endpoint Information:
## POST events
- If an event message is sent to event bus, relay to all other services.
- Request: 
```
type MESSAGETYPE = AccountCreated | AccountDeleted | FileCreated | FileModified | FileDeleted | FileModerated | ChangedPassword;

interface AccountDeleted {
  type: 'AccountDeleted',
  data: {
    uid: string
  }
}

interface FileDeleted {
  type: 'FileDeleted',
  data: {
    uid: string,
    fileId: string
  }
}


```

```

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
