var express = require("express");
var router = express.Router();
var users = require("../models/users");
var auth = require("../middleware/authentication");
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

router.post(
  "/getCurrentUser",
  auth.createSessionFromPersistantToken,
  auth.getUserBySessionToken,
  (req, res, next) => {
    res.json(req.user ? { user: req.user } : { nouser: true });
  }
);

router.post("/login", (req, res, next) => {
  var message = checkEmailPassword(req.body);
  if (message) {
    return res.status(422).json({ error: message });
  }
  users
    .validateUser(req.body.email, req.body.password)
    .then(user => {
      users.createSessionForUser(user).then(token => {
        res.cookie("session", token);
        res.json({ nickname: user.nickname, email: user.email });
      });
    })
    .catch(e => {
      console.log(e);
      res.status(500).send("DB Error");
    });
});

router.post("/signup", (req, res, next) => {
  var message = checkEmailPassword(req.body);
  if (message) {
    return res.status(422).json({ error: message });
  }
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
