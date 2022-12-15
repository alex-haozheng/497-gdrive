# **Upload/Download Microservice API**

## **Attribution**
**Created by Justin Baltazar** 

**Github: [@justinmbaltazar](https://github.com/justinmbaltazar)**

## **Overview**

The `uploadDownload` microservice is a RESTful API that allows the user to upload and download files. The `uploadDownload` microservice sends a `POST` and `GET` request respectively to the MongoDB server that queries the database for the file and then uploads a file to the database or downloads a file from the database.

## **Microservice Interaction**

The `uploadDownload` microservice interacts with the `fileService` microservice to get the file by `fileId`. The `uploadDownload` microservice also interacts with the `timeLogger` microservice to get the file by `fileId` and update the time stamp each time a `.txt` file is uploaded or downloaded. The service is hosted on port `4011`.

## **Endpoints**
- `GET /files/:fileId/download`
    - **Description:** Downloads a file by id. This should be a GET request to the server that queries the database for the file and then downloads it.
    - **Request** 
    ```json
    {
        "fileId": "ab03b4c5"
    }
    ```
    - **Response** 
    ```txt
    {
        "fileId": "ab03b4c5",
        "name": "file.txt",
        "size": 21,
        "tags": [
            "tag1",
            "tag2"
        ],
        "type": "text/plain",
        "date": "2019-01-01T00:00:00.000Z",
        "content": "This is file content."
    }
    ```
    - HTTP Status Codes:
        - 200: OK
        - 404: Not Found
        - 500: Internal Server Error
- `POST /files/upload`
    - **Description:** Uploads a file. This should be a POST request to the server that queries the database for the file and then uploads it to the database. The time stamp should be updated from the Time Logger microservice.
    - **Request**
    ```json
    {
        "name": "file",
        "content": "This is file content."
    }
    ```
    - **Response**
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "file",
        "size": 21,
        "tags": [
            "tag1",
            "tag2"
        ],
        "type": "text/plain",
        "date": "2019-01-01T00:00:00.000Z",
        "content": "This is file content."
    }
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 500: Internal Server Error

## **Installation and Usage**

*Note: The following instructions are for local, isolated testing. If you are using Docker, please refer to the [Docker Installation](#docker-installation-and-usage) section.*

**Prerequisites** [Node.js](https://nodejs.org/en/download/), [MongoDB](https://www.mongodb.com/download-center/community), [Git](https://git-scm.com/downloads), [npm](https://www.npmjs.com/get-npm), [Visual Studio Code](https://code.visualstudio.com/download), and language support for [JavaScript](https://code.visualstudio.com/docs/languages/javascript), [TypeScript](https://code.visualstudio.com/docs/languages/typescript), and [JSON](https://code.visualstudio.com/docs/languages/json).


### **Step 1: Clone the Repository**

```bash
git clone
```

### **Step 2: Install Dependencies**

Install global dependencies.

```bash
npm install
```

Install the dependencies for the `uploadDownload` microservice.

```bash
cd ./uploadDownload
npm install
```

### **Step 3: Start the `fileService` Service**

```bash
cd ../fileService
npm install
npm start
```

### **Step 4: Start the `event-bus` Service**

```bash
cd ../event-bus
npm install
npm start
```

### **Step 5: Start the `uploadDownload` Service**

```bash
cd ../uploadDownload
npm start
```

## **Docker Installation and Usage**

**Prerequisites** All specified prerequisites under [Installation](#installation-and-usage), [Docker](https://docs.docker.com/install/), and [Docker Compose](https://docs.docker.com/compose/install/).

### **Step 1: Clone the Repository**

Clone the repository to your local machine. *(This step is usually assumed, but it is included here for completeness.)*

```bash
git clone
```

### **Step 2: Start the `uploadDownload` Service**

```bash
docker compose up --build
```

*Note: If the `uploadDownload` service functionality is not working, try running the following command:*

```bash
cd ./uploadDownload
mkdir tempFiles
```