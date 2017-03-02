var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var session = require("express-session");
var authorizationPool = require("./connectionPools").authorizationPool;
var mysqlstore = require("express-mysql-session")(session);
//var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var index = require("./routes/index");
var users = require("./routes/users");
var webapi = require("./routes/webapi");
var randomValueBase64 = require("./models/users").randomValueBase64;
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

//app.use( bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

var sessionStore = new mysqlstore(
  {
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "sessionid",
        expires: "expires",
        data: "session"
      }
    }
  },
  authorizationPool
);

app.use(
  session({
    genid: function(req) {
      return randomValueBase64();
    },
		store: sessionStore,
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: true
    //		, cookie: { secure: true }
  })
);
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

process.env.BOILERPLATE_PASSWORD
  ? ""
  : console.log("BOILERPLATE_PASSWORD must be defined");
process.env.EXPRESS_SESSION
  ? ""
  : console.log("EXPRESS_SESSION must be defined");
