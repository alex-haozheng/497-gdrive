# Author: 
Yuri Kim

# Github: 
flffamlln

# Service Description: 
Contains information on which users are admins. Thinking of having the Admin service with an array of userIds of users that have admin access.  This service can add and remove admin access of a user given userId. This service allows admins to give a user admin / moderator access. It also allows admins to delete users / posts.

# Interaction with other services: 
If user is deleted, remove userID if in admin list.

# Endpoint Information: 

POST admin/:userId

- Adds a user as an admin using userId. This should be a POST request.

DELETE admin/:userId

- Removes a user as an admin using userId. This should be a DELETE request.

# How to run service:
