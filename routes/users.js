const express = require("express");
const router = express.Router();
const users = require("../models/users");
const passport = require("../passport");
const auth = require("../middleware/authentication");
const config = require("../config");
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

router.get("/test", auth.csrf, (req, res, next) => {
  res.json({ works: 1 });
});

router.post("/getCurrentUser", (req, res, next) => {
  try {
    if (req.user) {
      const CSRFToken = auth.randomValueBase64(20);
      req.session.CSRFToken = CSRFToken;
      req.session.cookie.maxAge = config.auth.sessionExpireTime;
      res.json({
        user: {
          nickname: req.user.nickname,
          email: req.user.email,
          username: req.user.username,
          csrftoken: CSRFToken
        }
      });
    } else {
      res.json({ nouser: true });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return res.status(422).json({ error: message });
    }
    if (!user) {
      return res.json({ error: "Failed to login" });
    }
    req.logIn(user, function(err) {
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

router.post("/logout", (req, res, next)=>{
	req.session.destroy();
	res.json({success: true});
});

router.post("/signup", (req, res, next) => {
  const message = checkEmailPassword(req.body);
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
