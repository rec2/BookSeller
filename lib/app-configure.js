require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

const app = express();

function configureApp() {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.static('public'));
    app.set("view engine", "ejs");
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        //   cookie: { secure: true }
    }));
}



module.exports = {
    configureApp : configureApp,
    app : app,
    passport: passport,
    session: session,
    passport: passport}