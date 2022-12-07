export default function isAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.admin) {
		next();
	} else {
		res.status(401).send('Unauthorized admin access');
	}
}
