# Service:
This service is the tag service.

# Author: 
This service's author is Yuri Kim.

# Github: 
This service's author's Github is flffamlln.

# Service Description: 
This tag service contains which tags and docIds of documents that were tagged with those tags. It contains information on fileIds (unique key) and their respective tags. This service allows users to add and remove tags to a file given a fileId, get all files tagged with a specific tag and get all tags.

# Interaction with other services: 
This tag service listens for a FileDeleted event. If it hears one, it removes that file from tag database if the file is in tag database because the file has been deleted.

# Port #:
This service runs on port 4001.

# Endpoint Information:

## POST events
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
{
	"message": "Removed file from tags DB"
}
```
- HTTP Status Codes: 
    - 201: OK
    - 400: BAD REQUEST
    - 500: Internal Server Error
---
## GET tag/:tag

- Returns all fileIds tagged with a specific tag.
- Request: 
```
{
    "tag": "[unique identifier]"
}
```
- Response:
```
{
	"data": [array of unique identifiers]
}
```
- HTTP Status Codes: 
    - 201: OK
    - 400: BAD REQUEST
    - 500: Internal Server Error
---
## GET tag/all

- Returns all tags.
- Request: 
```
{
}
```
- Response:
```
{
	"data": [array of unique identifiers]
}
```
- HTTP Status Codes: 
    - 201: OK
    - 400: BAD REQUEST
    - 500: Internal Server Error
---
## POST tag/:fileId/:tag

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
{
	"message": "Added a tag to a document"
}
```
- HTTP Status Codes:
    - 200: OK
    - 404: DOCUMENT ALREADY HAS THAT TAG
    - 500: INTERNAL SERVER ERROR
---
## DELETE tag/:fileId

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
    - 200: OK
    - 400: DOCUMENT DOES NOT HAVE THAT TAG
    - 404: TAG NOT FOUND
    - 500: INTERNAL SERVER ERROR
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
