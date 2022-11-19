# **Upload and Download Microservice (Justin)**

- `GET /files/:fileId/download`
    - Description: Downloads a file by id. This should be a GET request to the server that queries the database for the file and then downloads it.
    - Request: 
    ```json
    {
        "fileId": "ab03b4c5"
    }
    ```
    - Response: 
    ```json
    {
        "fileId": "ab03b4c5",       
        "name": "file.txt",
    }
    ```
    - HTTP Status Codes:
        - 200: OK
        - 404: Not Found
        - 500: Internal Server Error
- `POST /files/:fileId/upload`
    - Description: Uploads a file by id. This should be a POST request to the server that queries the database for the file and then uploads it to the database. The time stamp should be updated from the Time Logger microservice.
    - Request: 
    ```json
    {
        "fileId": "ab03b4c5"
    }
    ```
    - Response: 
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "file.txt",
        "time": "2019-01-01T00:00:00.000Z"
    }
    ```
    - HTTP Status Codes:
        - 200: OK
        - 304: Not Modified
        - 404: Not Found
        - 500: Internal Server Error