# Service:
This service is the Event bus.

# Authors + Githubs: 
The names and Githubs of team members are:

Yuri Kim (flffamlln) 

Alex Zheng (sazzle2)

Kays Laouar (kayslaouar)

Justin Baltazar (justinmbaltazar)

# Service Description: 
Contains message receiving and sending to all services with event message types declared and documented. 

# Interaction with other services: 
Event bus interacts with other services by relaying event messages it receives so other services can react to these event messages as necessary.

# Port #:
This service runs on port 4012.

# Endpoint Information:

## POST events
- If an event message is sent to event bus, relay to all other services.
- Request: 

```
type MESSAGETYPE = AccountCreated | AccountDeleted | FileCreated | FileUpdated | FileDeleted | FileOpened | ChangedPassword | ShootWordAnalytics | GetWordAnalytics | ShootFileAnalytics | GetFileAnalytics | AdminAdded | AdminRemoved;

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

interface AccountCreated {
  type: 'AccountCreated',
  data: {
    uid: string,
    email: string
  }
}

interface FileCreated {
  type: 'FileCreated',
  data: {
    uid: string,
    fileId: string
  }
}

interface FileOpened {
  type: 'FileOpened',
  data: {
    fileId: string
  }
}

interface FileUpdated {
  type: 'FileUpdated',
  data: {
    file: {
      fileId: string,
      content: string
    }
  }
}

interface ChangedPassword {
  type: 'ChangedPassword',
  data: {
    file: {
      fileId: string,
      content: string
    }
  }
}

interface File {
  fileId: string,
  content: string
}

interface ShootFileAnalytics {
  type: 'FileAnalytics'
}

interface GetFileAnalytics {
  type: 'FileAnalytics',
  data: {
    files: File[]
  }
}

interface ShootWordAnalytics {
  type: 'ShootWordAnalytics'
}

interface GetWordAnalytics {
  type: 'GetWordAnalytics',
  data: {
    badwords: []
  }
}

interface AdminAdded {
  type: 'AdminAdded'
}

interface AdminRemoved {
  type: 'AdminRemoved'
}
```

- Response:
```
{}
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

### **Step 3: Run the Application**

```bash
$ docker compose up --build
```

### **Step 5: View the Application**
- The command will locally host the website on `http://localhost:3000`.
