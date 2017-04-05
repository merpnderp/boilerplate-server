const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const httpsRedirect = require("./middleware/httpsRedirect");
const index = require("./routes/index");
const users = require("./routes/users");
const webapi = require("./routes/webapi");
const authPool = require("./connectionPools").authorizationPool;
const passport = require("./passport");
const config = require("./config");
const app = express();

/**
	* Set security options
	*/
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.use(httpsRedirect());

/**
	* Configure session
	*/
const sessionStore = new MySQLStore(
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
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    secret: config.expressSession,
    store: sessionStore,
    cookie: {
      maxAge: config.auth.sessionExpireTime,
      httpOnly: true,
      sameSite: true,
      secure: false
    }
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
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
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
