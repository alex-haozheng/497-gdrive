// user authentication
module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated !== undefined && req.isAuthenticated()) {
        next(); // calls next middleware
    } else {
        res.status(401).send('Unauthorized access');
    }
}

// admin authentication
module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated !== undefined && req.user !== undefined && req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).send('Unauthorized admin access');
    }
}