var authQuery = require("../connectionPools").authQuery;
var bcrypt = require("bcrypt");
var saltRounds = require("../config").auth.saltRounds;

exports.getUserFromSession = function(token) {
  return authQuery(
    "SELECT * FROM users WHERE id = (SELECT userid FROM sessions WHERE token = ?)",
    [token]
  );
};

exports.validateUser = function(email, password) {
  return getUserByEmail(email).then(user => {
    return bcrypt.compare(password, user.hash);
  });
};

exports.createNewUser = function(email, password) {
  if (!email || !password) {
    return Promise.reject(new Exception("Email and Password must be valid."));
  }
  return bcrypt.hash(password, saltRounds).then(hash => {
    return authQuery("INSERT INTO users set ? ", { email, hash });
  });
};

exports.getUserByEmail = getUserByEmail = function(email) {
  if (!email) {
    return Promise.reject(new Exception("Email is required."));
  }
  return authQuery("SELECT * FROM users WHERE email = ? ", [
    email
  ]).then(result => {
    return result.results.length > 0 ? result.results[0] : undefined;
  });
};
