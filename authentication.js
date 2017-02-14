const sessions = require('./models/sessions');
const getUserFromSession = require('./models/users').getUserFromSession;

exports.getUserFromSession = function (req, res, next) {
	try {
		if (req.cookies && req.cookies.session) {
			getUserFromSession(req.cookies.session).then((user) => {
				req.user = user;
				next();
			}).catch(next);
		} else {
			next();
		}
	} catch (err) {
		next(err);
	}
}

exports.getUserFromSessionOrAuthToken = function (req, res, next) {
	//if session, get user
	//if auth-token, set session, get user, 
}