var express = require("express");
var router = express.Router();
var users = require("../models/users");
var passport = require("../passport");
/* GET users listing. */

function checkEmailPassword(body) {
  if (!body.email) {
    return "Email required";
  }
  if (!body.password) {
    return "Password required";
  }
  return;
}

router.get("/test", (req, res, next) => {
  res.json({ works: 1 });
});

router.post("/getCurrentUser", (req, res, next) => {
  res.json(
    req.user
      ? {
          user: {
            nickname: req.user.nickname,
            email: req.user.email,
            username: req.user.username
          }
        }
      : { nouser: true }
  );
});

router.post("/login", (req, res, next) => {
  console.log("Logging in");
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return res.status(422).json({ error: message });
    }
    if (!user) {
      return res.json({ error: "Failed to login" });
    }
    req.logIn(user, function(err) {
      console.log("Logging in function");
      if (err) {
        return next(err);
      }
      return res.json({
        nickname: user.nickname,
        email: user.email,
        username: user.username
      });
    });
  })(req, res, next);
});

router.post("/signup", (req, res, next) => {
  var message = checkEmailPassword(req.body);
  if (message) {
    return res.status(422).json({ error: message });
  }
  console.log("creating new user");
  console.log(req.body);
  users
    .createNewUser(req.body.email, req.body.password)
    .then(rows => {
      res.json({ success: "true" });
    })
    .catch(e => {
      if (e.code == "ER_DUP_ENTRY") {
        res.status(422).json({ error: "That email already has an account" });
      } else {
        res.status(500).send(e);
      }
    });
});

module.exports = router;
