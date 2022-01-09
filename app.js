const dotenv = require('dotenv').config();
const express = require('express');
const passport = require('passport');
const mongoStore = require('connect-mongo');
const session = require('express-session');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require("path");


// import routes
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');
const userData = require('./routes/userData');

// express configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend")));


// cookies/session
app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: process.env.URL,
        dbName: process.env.DB_NAME,
        collection: 'sessions',
    }),
    cookie: {
        maxAge: 7 * 1000 * 60 * 60 * 25,
    }
}))

// password config
require('./auth/passportConfig');
app.use(passport.initialize());
app.use(passport.session());

app.use( (req,res,next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})


// routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/projects", projectsRouter);
app.use("/userData", userData);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/frontend/public/index.html"));
  });

module.exports = app;