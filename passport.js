const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const users = require("./models/users");
const bcrypt = require("bcrypt");
const saltRounds = require("./config").auth.saltRounds;

passport.use(
  new Strategy(function(username, password, cb) {
    users
      .findByUsername(username)
      .then(user => {
        if (!user) {
          return cb(null, false);
        }
        bcrypt
          .compare(password, user.hash)
          .then(success => {
            return cb(null, success ? user : false);
          })
          .catch(cb);
      })
      .catch(cb);
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
