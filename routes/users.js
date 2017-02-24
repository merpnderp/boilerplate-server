var express = require("express");
var router = express.Router();

var users = require("../models/users");

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

router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.post("/login", (req, res, next) => {
  var message = checkEmailPassword(req.body);
  if (message) {
    return res.status(422).json({ error: message });
  }
  users
    .validateUser(req.body.email, req.body.password)
    .then(success => {
      res.json({ success });
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
    .then(result => {
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
