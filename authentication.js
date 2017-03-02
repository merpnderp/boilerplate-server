const users = require("./models/users");
const crypto = require("crypto");

function randomValueBase64(len) {
	return crypto.randomBytes(Math.ceil(len)).toString("base64");
}

exports.setSessionToken = function(req, res, next) {
	var token = randomValueBase64(16);//.slice(0, 22);
};

exports.getUserBySessionToken = function(req, res, next) {
	try {
		if (req.cookies && req.cookies.session && req.cookies.session.length > 0) {
			users.getUserBySessionToken(req.cookies.session).then(user=>{
				req.user = user;
				next();
			}).catch(next);	
		} else {
			next();
		}
	} catch (err) {
		next(err);
	}
};

exports.getUserFromSessionOrAuthToken = function(req, res, next) {
	//if session, get user
	//if auth-token, set session, get user,
};
