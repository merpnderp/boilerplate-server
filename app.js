var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var bodyParser = require("body-parser");
var index = require("./routes/index");
var users = require("./routes/users");
var webapi = require("./routes/webapi");
var authPool = require("./connectionPools").authorizationPool;
var passport = require("./passport");
var app = express();

var sessionStore = new MySQLStore(
  {
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "sessionid",
        expires: "expires",
        data: "data"
      }
    }
  },
  authPool
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    httpOnly: true,
    name: "sessionId",
    resave: false,
    sameSite: true,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION,
    secure: false,
    store: sessionStore
  })
);

// Initialize Passport and restore authentication state, if any, from the
// // session.
app.use(passport.initialize());
app.use(passport.session());

app.use("/", index);
app.use("/users", users);
app.use("/webapi", webapi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV == "production" ? {} : err;

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

process.on("uncaughtException", err => {
  console.log(`Caught exception: ${err}`);
});
