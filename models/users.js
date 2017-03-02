const authQuery = require("../connectionPools").authQuery;
const bcrypt = require("bcrypt");
const saltRounds = require("../config").auth.saltRounds;
const crypto = require("crypto");

exports.validateUser = function(email, password) {
  return getUserByEmail(email).then(user => {
    return bcrypt.compare(password, user.hash).then(success => {
      return success ? user : success;
    });
  });
};

exports.createNewUser = function(email, password) {
  if (!email || !password) {
    return Promise.reject(new Error("Email and Password must be valid."));
  }
  return bcrypt.hash(password, saltRounds).then(hash => {
    return authQuery("INSERT INTO users set ? ", { email, hash });
  });
};

exports.getUserByEmail = getUserByEmail = function(email) {
  if (!email) {
    return Promise.reject(new Error("Email is required."));
  }
  return authQuery("SELECT * FROM users WHERE email = ? ", [
    email
  ]).then(rows => {
    return rows.length > 0 ? rows[0] : undefined;
  });
};

exports.getUserBySessionToken = function(token) {
  if (!token) {
    return Promise.reject(new Error("sessionID must not be null"));
  }
  return authQuery( "SELECT * from users WHERE id = (SELECT userid FROM sessions WHERE token = ? and valid = 1 )", [token])
    .then(rows => {
      return rows && rows.length > 0
        ? rows[0]
        : undefined;
    })
    .catch(e => {
      console.log(e);
    });
};

function randomValueBase64(len) {
  return crypto
    .randomBytes(Math.ceil(len))
    .toString("base64")
    .replace(/[\+\/]/g, "0"); // replace '+' & '/' with '0'
}

exports.randomValueBase64 = randomValueBase64;

exports.createSessionForUser = function(user) {
  if (!user) {
    return Promise.reject(new Error("user must not be null"));
  }
  var token = randomValueBase64(16);
  var userid = user.id;
  return authQuery("INSERT INTO sessions set ? ", {
    token,
    userid
  }).then(() => {
    return token;
  });
};
exports.createPersistantTokenForUser = function(user) {
  if (!user) {
    return Promise.reject(new Error("user must not be null"));
  }
  var token = randomValueBase64(16);
  var userid = user.id;
  return authQuery("INSERT INTO sessions set ? ", {
    token,
    userid
  }).then(() => {
    return token;
  });
};
