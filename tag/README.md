# Author: 
This service's author is Yuri Kim.

# Github: 
This service's author's Github is flffamlln.

# Service:
This service is the tag service.

# Service Description: 
This tag service contains which tags and fileId of documents that were tagged with those tags. It contains information on fileIds (unique key) and their respective tags. This service allows users to add and remove tags to a file given a fileId, get all files tagged with a specific tag and get all tags.

# Interaction with other services: 
This tag service listens for a FileDeleted event. If it hears one, it removes that file from tag database if the file is in tag database because the file has been deleted.

# Port #:
This service runs on port 4001.

# Endpoint Information:

## POST /events
- If a file is removed event message is heard, remove document from tags DB.
- Request: 
```
{
	"type": "FileDeleted",
    "data": {
        "uId": "[unique identifier]",
        "fileId": "[String]"
    }
}
```
- Response:
```
{ message: "File deleted" }
```
- HTTP Status Codes: 
    - 201: { message: "File deleted" }
    - 400: { message: 'BAD REQUEST' }
    - 404: { message: 'File does not exist in tags db' }
    - 500: {message: 'INTERNAL SERVER ERROR'}
---
## GET /getFiles/:tag

- Returns all files tagged with a specific tag.
- Request: 
```
[
  {
            "tag": "[String]",
            "fileId": "[String]"
        }
]
```
- Response:
```
[
  {
            "tag": "[String]",
            "fileId": "[String]"
        }
]
```
- HTTP Status Codes: 
    - 201: [
  {
            "tag": "[String]",
            "fileId": "[String]"
        }
]
    - 400: { message: 'BAD REQUEST' }
    - 404: { message: 'Tag not in tag database' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## GET /getTags

- Returns all tags in tags db.
- Request: 
```
{
}
```
- Response:
```
[
String
]
```
- HTTP Status Codes: 
    - 201: [
String
]
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## POST /addTag/:fileId/:tag

- Adds a tag to a file based on fileId.
- Request:
```
{
	"fileId": "[unique idenitifier]",
	"tag": "[String]"
}
```
- Response:
```
{ message: 'Tag added to doc'}
```
- HTTP Status Codes:
    - 200: { message: 'Tag added to doc'}
    - 304: { message: 'Doc already tagged with that tag' }
    - 400: { message: 'BAD REQUEST' }
    - 500: { message: 'INTERNAL SERVER ERROR' }
---
## DELETE /removeTag/:tag/:fileId

- Removes a tag from a file.
- Request:
```
{
	"fileId":"[unique idenitifier]",
	"tag": "[String]"
}
```
- Response:
```
{
	"message": "Removed tag from document"
}
```
- HTTP Status Codes:
    - 200: { message: "Deleted tag from doc" }
    - 400: { message: 'BAD REQUEST' }
    - 404: { message: 'Tag does not exist in tags db' }
    - 500: { message: 'INTERNAL SERVER ERROR' }

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
  tag:
    build: tag
    ports:
      - "4001:4001"
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
- The command from Step 4 will locally host the website on `http://localhost:4001`.
- There is a ThunderClient test collection called thunder-collection_tag.json in tag directory. Open this with ThunderClient extension and test endpoints with them.
