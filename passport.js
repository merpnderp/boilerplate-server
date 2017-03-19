const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const users = require("./models/users");
const bcrypt = require("bcrypt");
const saltRounds = require("./config").auth.saltRounds;

function handleAuth(user, password) {
  return new Promise((resolve, reject) => {
    if (!user) {
      setTimeout(
        function() {
          reject(false);
        },
        Math.random() * (750 - 250) + 250
      );
    } else {
      setTimeout(
        function() {
          bcrypt
            .compare(password, user.hash)
            .then(success => {
              return success ? resolve(user) : reject(success);
            })
            .catch(reject);
        },
        user.failedattempts * 250
      );
    }
  });
}

passport.use(
  new Strategy(function(username, password, cb) {
    users
      .findByUsernameForAuth(username)
      .then(user => {
        return handleAuth(user, password);
      })
      .then(user => {
        if (user) {
          users.successfulLogin(user.id);
          cb(null, user);
        } else {
          users.failedLogin(user.id);
          cb(null, false);
        }
      })
      .catch(error=>{
				cb(null, false);
			});
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  users
    .findById(id)
    .then(user => {
      cb(null, user);
    })
    .catch(cb);
});

module.exports = passport;
