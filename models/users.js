var authQuery = require('../connectionPools').authQuery;


exports.getUserFromSession = function(token){
	return authQuery("SELECT * FROM users WHERE id = (SELECT userid FROM sessions WHERE token = ?)", [token]);	
}

exports.createNewUser = function(user){
	return authQuery("INSERT INTO users set")
}