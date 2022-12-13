# Service:
This is our client (front-end) service.

# Authors + Githubs:
The authors and Githubs of this service are: 
Yuri Kim (flffamlln) 
Alex Zheng (sazzle2)
Kays Laouar (kayslaouar)
Justin Baltazar (justinmbaltazar)

# Service Description: 
Client is a front-end service that has UI components and talks to our other services to retrieve information and complete user actions.

Admin UI will allow adding of an admin and removing of an admin.

Profile UI will allow viewing a user's profile details and editing parts of a user's profile details.

The Forgot Password UI will allow the client to access the questions endpoint.

The File Compression UI will allow the client to download files onto their local machine.

Auth UI will allow people to register/login/out.

Analytics UI will allow admins to see aggregate data about all files in the app.

# Interaction with other services: 
Client service interacts with other services to create UI components. For example:

Admin UI interacts with admin service to show who are admins and who are not admins.

Profile UI interacts with profile service to show user's profile details.

FileCompression UI interacts with the file service to update the status (opened / closed) of current selected files.

Questions UI interacts with the authentication service as it changes the password on the database followed by an email. 

Auth UI interacts with auth service (sends it username, email, password for registration, username password for login).

Analytics UI interacts with analytics service. Displays analytics that service provides.

# Port #:
This service runs on port 3000.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
