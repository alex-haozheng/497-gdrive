# **Time Logger Microservice API**

## **Attribution**
**Created by Justin Baltazar** 

**Github: [@justinmbaltazar](https://github.com/justinmbaltazar)**

## **Overview**

The `timeLogger` microservice is a RESTful API that allows other microservices to log the time of a file by creating a new `Date()` object and appending it to the file. The `timeLogger` microservice also allows other microservices to get the time of a file by sending a GET request to the server that queries the database for the file and then returns the file with the time stamp.

### **Microservice Interaction**

The `timeLogger` microservice interacts with the fileService microservice to get the file by `fileId` and update the time stamp. The `timeLogger` microservice also interacts with the `uploadDownload` microservice to get the file by `fileId` and update the time stamp each time a `.txt` file is uploaded or downloaded. The service is hosted on port `4010`.

## **Endpoints**
- `GET /files/:fileId/time`
    - **Description:** Gets the time of a file by `fileId`. This endpoint is a `GET` request to the server that queries the database for the file and then returns the file with the current time stamp.
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
        "date": "2019-01-01T00:00:00.000Z",
    }
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 404: Not Found
        - 500: Internal Server Error
- `PUT /files/:fileId/time`
    - **Description:** Updates the time of a file by `fileId`. This endpoint is a `PUT` request to the server that queries the database for the file and then updates the time stamp.
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
        "date": "2019-01-01T00:00:00.000Z",
    }
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 304: Not Modified
        - 404: Not Found
        - 500: Internal Server Error

- `GET /files/:fileId/time/parse`
    - **Description:** Gets the time of a file by `fileId` and parses it into a human-readable format. This endpoint is a `GET` request to the server that queries the database for the file and then returns the file with the difference between the current time and the time stamp in a human-readable format.
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
        "date": "2019-01-01T00:00:00.000Z",
        "dateStr": "3 years, 11 months"
    }
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 404: Not Found
        - 500: Internal Server Error
-  `POST /events`
    - **Description:** Sends events to the event bus. This endpoint should send events to the event bus and handle them accordingly.
    - **Request**
    ```json
    {
        "type": "FileCreated",
        "data": {
            "fileId": "ab03b4c5"
        }
    }
    ```
    - **Response**
    ```json
    {}
    ```
    - **HTTP Status Codes**
        - 200: OK
        - 500: Internal Server Error

## **Installation and Usage**

*Note: The following instructions are for local, isolated testing. If you are using Docker, please refer to the [Docker Installation](#docker-installation-and-usage) section.*

**Prerequisites:** [Node.js](https://nodejs.org/en/download/), [MongoDB](https://www.mongodb.com/download-center/community), [Git](https://git-scm.com/downloads), [npm](https://www.npmjs.com/get-npm), [Visual Studio Code](https://code.visualstudio.com/download), and language support for [JavaScript](https://code.visualstudio.com/docs/languages/javascript), [TypeScript](https://code.visualstudio.com/docs/languages/typescript), and [JSON](https://code.visualstudio.com/docs/languages/json).

### **Step 1: Clone the Repository**

Clone the repository to your local machine. *(This step is usually assumed, but it is included here for completeness.)*

```bash
git clone
```

### **Step 2: Install Dependencies**

Install global dependencies.

```bash
npm install
```

Install the dependencies for the `timeLogger` microservice.

```bash
cd ./timeLogger
npm install
```

### **Step 3: Start the `fileService` microservice**

```bash
cd ../fileService
npm install
npm start
```

### **Step 4: Start the `event-bus` microservice**

```bash
cd ../event-bus
npm install
npm start
```

### **Step 5: Start the `timeLogger` microservice**

```bash
cd ./timeLogger
npm start
```

## **Docker Installation and Usage**

**Prerequisites:** All specified prerequisites under [Installation](#installation-and-usage), [Docker](https://docs.docker.com/install/), and [Docker Compose](https://docs.docker.com/compose/install/).

### **Step 1: Clone the Repository**

Clone the repository to your local machine. *(This step is usually assumed, but it is included here for completeness.)*

```bash
git clone
```

### **Step 2: Start the `timeLogger` microservice**

```bash
docker compose up --build
```