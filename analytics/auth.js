"use strict";
exports.__esModule = true;
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    }
    else {
        res.status(401).send('Unauthorized admin access');
    }
}
exports["default"] = isAdmin;
