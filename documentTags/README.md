# Author: 
Yuri Kim

# Github: 
flffamlln

# Service Description: 
Contains information on fileIds (unique key) and their respective tags. These tags are stored in an array and are in String format. This service allows users to add and remove tags to a file given a fileId.

# Interaction with other services: 
- If document deleted, remove document from index.

# Endpoint Information:

POST tag/:fileId/:work

- Adds a tag to a post using fileId.

DELETE tag/:fileId

- Removes a tag from a file.

# How to run service:
