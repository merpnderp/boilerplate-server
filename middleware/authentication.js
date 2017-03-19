const users = require("../models/users");
const crypto = require("crypto");

function randomValueBase64(len) {
  return crypto.randomBytes(Math.ceil(len)).toString("base64");
}

exports.randomValueBase64 = randomValueBase64;

exports.setSessionToken = function(req, res, next) {
  const token = randomValueBase64(16); //.slice(0, 22);
};

exports.csrf = function(req, res, next) {
  if (req.session.CSRFToken == req.get("X-CSRF-TOKEN")) {
    next();
  } else {
    next(new Error("CSRF Token mismatch"));
  }
};
