## **Files Microservice (Justin)**

### Port: 4009

- `GET /files`
    - Description: Gets all files. This endpoint should query the database for all files and return them in a JSON array.
    - Request: None
    - Response: 
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
    - HTTP Status Codes:
        - 200: OK
        - 500: Internal Server Error
- `GET /files/:id`
    - Description: Gets a file by fileId from the database. This endpoint should query the database for a file with the given fileId and return it in a JSON object.
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
    - HTTP Status Codes:
        - 200: OK
        - 404: Not Found
        - 500: Internal Server Error
- `POST /files`
    - Description: Creates and uploads a file to the database. This endpoint should upload a file to the database and return the fileId of the file in a JSON object.
    - Request: 
    ```json
    {
        "fileId": "ab03b4c5",
        "content": "This is file content."
    }
    ```
    - Response: 
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "file.txt",
        "size": 100,
        "tags": [],
        "type": "text/plain",
        "date": "2019-01-01T00:00:00.000Z",
        "content": "This is file content."
    }
    - HTTP Status Codes:
        - 200: OK
        - 400: Bad Request
        - 409: Conflict
        - 500: Internal Server Error        
- `DELETE /files/:fileId`
    - Description: Deletes a file by fileId. This endpoint should delete a file with the given fileId from the database and return the fileId of the file in a JSON object.
    - Request: 
    ```json
    {
        "id": "ab03b4c5"
    }
    ```
    - Response: 
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "file.txt"
    }
    ```
    - HTTP Status Codes:
        - 200: OK
        - 404: Not Found
        - 500: Internal Server Error
- `PUT /files/:fileId`
    - Description: Updates a file by fileId. This endpoint should update a file with the given fileId from the database and return the fileId of the file in a JSON object.
    - Request: 
    ```json
    {
        "fileId": "ab03b4c5",
        "content": "This is the updated file content."
    }
    ```
    - Response: 
    ```json
    {
        "fileId": "ab03b4c5",
        "name": "file.txt",
        "time": "2019-01-01T00:00:00.000Z",
        "content": "This is the updated file content."
    }
    - HTTP Status Codes:
        - 200: OK
        - 400: Bad Request
        - 404: Not Found
        - 500: Internal Server Error