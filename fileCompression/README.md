# Author: 
Alex Zheng

# Github: 
sazzle2

# Service Description: 
The endpoint will handle the file compression, whenever an update is made on the UI or when a user enters something the endpoint will use this information. not only is it a microservice its a zipping compression microservice even more scalability. :)


# Interaction with other services: 
This server will handle opening and closing files and handling the changes made through the file service. This will also have events coming in from the frontend service which will activte a zip to be downloaded to the user desktop

## **Endpoint Information:**

- `POST /event`

    - Description: Listens to file events and returns the compressed version (or updates on a file)

- `POST /user/file/zip`
    
    - Description: Listens to this endpoint where it will zip the file stored on the compressed version (the database along this endpoint)
    option to download uncompressed and compressed file

- Request:
```json
{
    "fileId": "ab33322" 
}
```
- Response:
```json
{
    "fileId": "ab333",
    "content": "text text hola"
}
```

### **Events:**
- `fileOpened`
    Description: decompress whats in the database and return it
- `fileChanged`
    Description: compress the content and push into database

- `GET user/file/zip` 
    - Description: downloads a zip functionality for users
    - Request:
    ```json
    {
        "fileid": "ab03b4c5" 
    } 
    ```
    - Response:
    ```json
    {
        "content": "string"
    }
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
