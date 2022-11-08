# Author: 
Yuri Kim

# Github: 
flffamlln

# Service Description: 

Contains information on a user including userId (unique key), email, password, name and misc. information such as a user’s status / bio. This service can create, read, update and delete profile details of a user given a userId.

# Interaction with other services: 

- If user deleted, remove their profile.

- If password updated, update password in profile.

# Endpoint Information:

GET /profile/:userId

- Gets profile details by userId.

PUT /profile/:userId

- Updates a profile details by userId.

POST /profile/:userId

- Creates a profile details by userId.

DELETE /profile/:userId

- Creates a profile details by userId.

# How to run service: