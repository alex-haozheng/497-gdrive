export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next(); // calls next middleware
    } else {
        res.status(401).send('Unauthorized access');
    }
}

export function isAdmin (req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).send('Unauthorized admin access');
    }
}