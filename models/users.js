var authQuery = require('../connectionPools').authQuery;


exports.getUserFromSession = function(token){
	return authQuery("SELECT * FROM users WHERE id = (SELECT userid FROM sessions WHERE token = ?)", [token]);	
}