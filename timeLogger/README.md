## **Document Time Logger Microservice (Justin)**

- `GET /files/:fileId/time`
    - Description: Gets the time of a file by id. This should be a GET request to the server that queries the database for the file and then returns the time stamp.
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
        - 404: Not Found
        - 500: Internal Server Error
- `PUT /files/:fileId/time`
    - Description: Updates the time of a file by id. This should be a PUT request to the server that queries the database for the file and then updates the time stamp.
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