// following https://paragonie.com/blog/2015/04/secure-authentication-php-with-long-term-persistence

const authQuery = require('../connectionPools').authQuery;
const tokenExpireTime = require('../config').auth.tokenExpireTime;
const uid = require('uid-safe')

exports.getAuthToken = function (selector) {
	return authQuery("SELECT * FROM auth_tokens WHERE selector = ?", [selector]);
}

exports.setAuthToken = function (selector, token, userid) {
	var expires = new Date();
	expires.setHours(expires.getHours + tokenExpireTime);
	return authQuery("INSERT INTO auth_tokens SET ?", { selector, token, userid });
}

exports.getSession = function (sessionID) {
	return authQuery("SELECT * FROM sessions WHERE sessionID = ?", [sessionID]);
}

exports.setSession = function (token, userid) {
	return authQuery("INSERT INTO sessions SET ?", { token, userid });
}
