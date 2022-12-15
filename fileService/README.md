# **File Service Microservice API**

## **Attribution**
**Created by Justin Baltazar** 

**Github: [@justinmbaltazar](https://github.com/justinmbaltazar)**

## **Overview**

The `fileService` microservice is a RESTful API that allows the user to perform CRUD operations on files. The `fileService` microservice sends a `POST`, `GET`, `PUT`, and `DELETE` request respectively to the MongoDB server that queries the database for the file and then uploads a file to the database, gets a file from the database, updates a file in the database, and deletes a file from the database. The service is hosted on port `4009`.

## **Microservice Interaction**

The `fileService` microservice interacts with the `timeLogger` microservice to get the file by `fileId` and update the time stamp each time a `.txt` file is uploaded or downloaded. The `fileService` microservice also interacts with the `event-bus` microservice to send a `POST` request to the `event-bus` microservice to create a new event each time a file is created, updated, deleted, or edited. The `fileService` microservice also sends event messages to the `event-bus` microservice each time a file is updated or deleted, which is then received by the `moderator` and `analytics` microservices. 

## **Endpoints**

- `GET /files`
    - **Description:** Gets all files. This endpoint should query the database for all files and return them in a JSON array.
    - **Request** None
    - **Response** 
    ```json
    {
        "files": [
            {
                "fileId": "ab03b4c5",
                "name": "file.txt",
                "size": 100,
                "tags": [
                    "tag1",
                    "tag2"
                ],
                "type": "text/plain",
                "date": "2019-01-01T00:00:00.000Z",
                "content": "This is file content."
            },
            {
                "fileId": "ab03b4c6",
                "name": "file2.txt",
                "size": 100,
                "tags": [
                    "tag1",
                ],
                "type": "text/plain",
                "date": "2019-01-01T00:00:00.000Z",
                "content": "This is file content."
            }
        ]
    }
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 500: Internal Server Error
- `GET /files/:fileId`
    - **Description:** Gets a file by fileId from the database. This endpoint should query the database for a file with the given fileId and return it in a JSON object.
    - **Request**
    ```json
    {
        "fileId": "ab03b4c5"
    }
    ```
    - **Response**
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "file.txt",
        "size": 100,
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
        - 404: Not Found
        - 500: Internal Server Error
- `POST /files`
    - **Description:** Creates and uploads a file to the database. This endpoint should upload a file to the database and return the fileId of the file in a JSON object.
    - **Request** 
    ```json
    {
        "name": "sample",
        "content": "This is file content."
    }
    ```
    - **Response**
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "sample.txt",
        "size": 21,
        "tags": [],
        "type": "text/plain",
        "date": "2019-01-01T00:00:00.000Z",
        "content": "This is file content."
    }
    - HTTP Status Codes:
        - 200: OK
        - 400: Bad Request
        - 500: Internal Server Error        
- `DELETE /files/:fileId`
    - **Description:** Deletes a file by fileId. This endpoint should delete a file with the given fileId from the database and return the fileId of the file in a JSON object.
    - **Request**
    ```json
    {
        "id": "ab03b4c5"
    }
    ```
    - **Response**
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "sample.txt",
        "size": 21,
        "tags": [],
        "type": "text/plain",
        "date": "2019-01-01T00:00:00.000Z",
        "content": "This is file content."
    }
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 404: Not Found
        - 500: Internal Server Error
- `PUT /files/:fileId`
    - **Description:** Updates a file by fileId. This endpoint should update a file with the given fileId from the database and return the fileId of the file in a JSON object.
    - **Request** 
    ```json
    {
        "fileId": "ab03b4c5",
        "content": "This is the updated file content."
    }
    ```
    - **Response** 
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "file.txt",
        "size": 100,
        "tags": [
            "tag1",
            "tag2"
        ],
        "type": "text/plain",
        "date": "2019-01-01T00:00:00.000Z",
        "content": "This is the updated file content."
    }
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 400: Bad Request
        - 404: Not Found
        - 500: Internal Server Error
- `POST /events`
    - **Description:** Receives events from the event bus. This endpoint should receive events from the event bus and handle them accordingly.
    - **Request** 
    ```json
    {
        "type": "FileCreated",
        "data": {
            "fileId": "ab03b4c5",
            "name": "file.txt",
            "size": 100,
            "tags": [
                "tag1",
                "tag2"
            ],
            "type": "text/plain",
            "date": "2019-01-01T00:00:00.000Z",
            "content": "This is file content."
        }
    }
    ```
    - **Response** 
    ```json
    {}
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 400: Bad Request
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

Install the dependencies for the `fileService` microservice.

```bash
cd ./fileService
npm install
```

### **Step 3: Start the `event-bus` Service**

```bash
cd ../event-bus
npm install
npm start
```

### **Step 4: Start the `timeLogger` Service**

```bash
cd ../timeLogger
npm install
npm start
```

### **Step 5: Start the `fileService` Service**

```bash
cd ../fileService
npm start
```

## **Docker Installation and Usage**

**Prerequisites** All specified prerequisites under [Installation](#installation-and-usage), [Docker](https://docs.docker.com/install/), and [Docker Compose](https://docs.docker.com/compose/install/).

### **Step 1: Clone the Repository**

Clone the repository to your local machine. *(This step is usually assumed, but it is included here for completeness.)*

```bash
git clone
```

### **Step 2: Start the `fileService` Service**

```bash
docker compose up --build
```