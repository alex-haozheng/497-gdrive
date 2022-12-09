# **Analytics Microservice**

## Author: Kays Laouar

## GitHub: kayslaouar

### Port: 4003

# Service:

This service is the Analytics (analytics) service.

# Service Description:

This service provides some analytics on files across the across all users. Provides the number of files in the system, a list of all files flagged by the moderator service for having words that are very similar to a list of blacklisted words, and a distribution of the grade level of writing of all files. The last analytic provides insight into the grade level of writing of a file. To accomplish this, we scan through the file and count the average number of words in a sentence, and the average number of letters in a word. The larger the words and longer the sentences, the more advanced the grade level of writing is. We use the Coleman-Liau index https://en.wikipedia.org/wiki/Coleman–Liau_index to assign actual grade level numbers to a file.

# Interaction with other services:

The analytics are updated asynchronously every 24 hours. The service shoots two events out. One to the file service to get all files for readability/grade level analysis and one to the moderator service to allow admins to read through flagged files and decide on whether it is problematic for that file to be in the system (may contain offensive content for example). The service listens for two events that are a response to the shot out events. Basically, every 24 hours, the analytics service shoots out two events: ShootFileAnalytics and ShootWordAnalytics. The ShootFileAnalytics event goes to the file service. In response to this event, the file service responds with a list of all files that exist in the system. This analytics service awaits this response at the /events endpoint, where it expects to receive a GetFileAnalytics event containing a list of all files. The ShootWordAnalytics event goes to the moderator service. In response to this event, the moderator service sends a list of all files that were flagged for potentially containing blacklisted words. The moderator service sends out a GetWordAnalytics event that the analytics service listens for to update its local data.

-   `GET /analytics`
    -   Description: Admin only endpoint that allows admins to view files that was flagged by moderator, view the distribution of grade level writing, and view the number of files
    -   Request: None
    -   Response:

```json
{
	"numFiles": 100,
	"readability": {
		"1": 10,
		"2": 20,
		"3": 30
	},
	"badfiles": [
		{
			"fileId": "12345678",
			"content": "this file is in the bad files list because it contains a blacklisted word"
		}
	]
}
```

-   HTTP Status Codes:
    -   200: OK
    -   500: Server Error

# How to run service:

### **Step 1: Prerequisites**

-   [Node](https://nodejs.org/en/)
-   [NPM](https://www.npmjs.com/)
-   [VSCode](https://code.visualstudio.com/)
    -   Install the appropriate language support for each language used in the project.
-   [React.js](https://reactjs.org/)
-   [Git](https://git-scm.com/)
-   [Express.js](https://expressjs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [Docker](https://www.docker.com/)
-   [Kubernetes](https://kubernetes.io/)

### **Step 2: Clone the Repository**

-   Navigate to the desired project directory on your computer.

-   Clone the repository from [GitHub](https://github.com/umass-cs-497s-F22/milestone-2-implementation-team0.git) using the `git clone` command.

```bash
$ git clone https://github.com/umass-cs-497s-F22/milestone-2-implementation-team0.git
```

-   Navigate to the cloned repository directory.

```bash
$ cd name-of-cloned-repository
```

### **Step 3: Comment out other service running code in docker-compose.yml**

-   Uncommented code in docker-compose.yml should just have admin service, event-bus service and mongodbcontainer.

```
version: '3.9'
services:
  auth:
    build: auth
    ports:
      - "4003:4003"
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

-   Run the application using the `docker compose up --build` command.

```bash
$ docker compose up --build
```

### **Step 5: Test endpoints with Thunder Client**

-   The command from Step 4 will locally host the website on `http://localhost:4004`.
-   There is a ThunderClient test collection called thunder-collection-admin.json in admin directory. Open this with ThunderClient extension and test endpoints with them.
