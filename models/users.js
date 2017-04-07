const authQuery = require("../connectionPools").authQuery;
const bcrypt = require("bcrypt");
const saltRounds = require("../config").auth.saltRounds;
const crypto = require("crypto");

exports.validateUser = function(username, password) {
  return findByUsername(username).then(user => {
    return bcrypt.compare(password, user.hash).then(success => {
      return success ? user : success;
    });
  });
};

exports.createNewUser = function(username, password) {
  if (!username || !password) {
    return Promise.reject(new Error("Username and Password must be valid."));
  }
  return bcrypt.hash(password, saltRounds).then(hash => {
    return authQuery("INSERT INTO users set ? ", { username, hash });
  });
};

exports.findById = findById = function(id, cb) {
  if (!id) {
    return Promise.reject(new Error("ID is required."));
  }
  return authQuery("SELECT * FROM users WHERE id = ? ", [id]).then(rows => {
    return rows.length > 0 ? rows[0] : undefined;
  });
};

exports.findByUsername = findByUsername = function(username) {
  if (!username) {
    return Promise.reject(new Error("Username is required."));
  }
  return authQuery("SELECT * FROM users WHERE username = ? ", [
    username
  ]).then(rows => {
    return rows.length > 0 ? rows[0] : undefined;
  });
};

exports.findByUsernameForAuth = function(username) {
  if (!username) {
    return Promise.reject(new Error("Username is required."));
  }
  return authQuery(
    "SELECT * FROM users as u LEFT JOIN last_auth_attempts as l on u.id = l.userid WHERE u.username = ? ",
    [username]
  ).then(rows => {
    return rows.length > 0 ? rows[0] : undefined;
  });
};

exports.failedLogin = function(id) {
  if (!id) {
    return Promise.reject(new Error("id is required."));
  }
  return authQuery(
    `INSERT INTO last_auth_attempts (userid, failedattempts) 
	 	VALUES(?, 1) ON DUPLICATE KEY UPDATE failedattempts = failedattempts + 1`,
    [id]
  );
};

exports.successfulLogin = function(id) {
  if (!id) {
    return Promise.reject(new Error("id is required."));
  }
  return authQuery(
    `INSERT INTO last_auth_attempts (userid, failedattempts, lastsuccessfulattempt) 
	 	VALUES(?, 0, now()) 
		ON DUPLICATE KEY UPDATE failedattempts = 0, lastsuccessfulattempt = now()`,
    [id]
  );
};

exports.deleteSessionForUser = function(id) {
  if (!id) {
    return Promise.reject(new Error("id is required."));
  }
  authQuery("DELETE FROM sessions WHERE id = ?", [id]);
};

exports.updateUser = function(user) {
  if (!user) {
    return Promise.reject(new Error("user object is required."));
  }
  return authQuery(
    "UPDATE users SET nickname = ?, username = ?, email = ?, hash = ?, imagetoken = ?",
    [user.nickname, user.username, user.email, user.hash, user.imagetoken]
  );
};

exports.updateImageToken = function(userID, token) {
  if (!userID || !token) {
    return Promise.reject(new Error("userID and token are required."));
  }
  return authQuery("UPDATE users SET imagetoken = ? WHERE id = ?", [
    token,
    userID
  ]);
};

/*exports.getUserBySessionToken = function(token) {
  if (!token) {
    return Promise.reject(new Error("sessionID must not be null"));
  }
  return authQuery(
    "SELECT * from users WHERE id = (SELECT userid FROM sessions WHERE token = ? and valid = 1 )",
    [token]
  )
    .then(rows => {
      return rows && rows.length > 0 ? rows[0] : undefined;
    })
    .catch(e => {
      console.log(e);
    });
};*/
