"use strict";
// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.
var express = require("express");
var app = express();
var fs = require("fs");
var banned = [];
banUpperCase("./public/", "");

// Define the sequence of functions to be called for each request.  Make URLs
// lower case, ban upper case filenames, require authorisation for admin.html,
// and deliver static files from ./public.
app.use(lower);
app.use(ban)

/*****************************************
    Initialize User Sessions
    - Express-Session Module
    - UUID Module
*****************************************/
const session = require('express-session');
const uuid = require('uuid/v4');
var ssn = null;
app.use(session({
    genid: (req) => {
        console.log('Inside the session middlware');
        return uuid();
    },
    secret: 'keyboard cat', //Change to env variable in prod environment
    resave: false,
    saveUninitialized: true
}))

app.all("/", auth);
var options = { setHeaders: deliverXHTML };
app.use(express.static("public", options));
app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");

/*****************************************
    Imported Node Modules
*****************************************/
const bodyParser = require('body-parser');
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const expressValidator = require('express-validator');
app.use(expressValidator());

const path = require('path');
app.set('view engine', 'ejs');

/*****************************************
    Initialize PassportJS (Local-Strategy)
    - PassportJS
*****************************************/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
});

// Make the URL lower case.
function lower(req, res, next) {
    req.url = req.url.toLowerCase();
    next();
}

// Forbid access to the URLs in the banned list.
function ban(req, res, next) {
    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send("Filename not lower case");
            return;
        }
    }
    next();
}

// Redirect the browser to the login page.
function auth(req, res, next) {
    console.log('Inside the homepage callback function');
    res.render('index',{
        user: null
    });

}

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, path, stat) {
    if (path.endsWith(".html")) {
        res.header("Content-Type", "application/xhtml+xml");
    }
}

// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(root + folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        var mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}

/******************************************************************************
******************************************************************************
                                Handle Routing
******************************************************************************
******************************************************************************/
var users = require('./routers/users.js');
var market = require('./routers/market.js');
var questions = require('./routers/questions.js');
var responses = require('./routers/responses.js');
var notification = require('./routers/notification.js');
var nav = require('./routers/nav.js');
app.use('/', users);
app.use('/', market);
app.use('/', questions);
app.use('/', responses);
app.use('/', notification);
app.use('/', nav);

/*****************************************
    Error Handling
*****************************************/
app.use(function(err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500; // Sets a generic server error status code if none is part of the err

    if (err.shouldRedirect) { // Renders a index.ejs for the user
        var user = null;
        if(req.user) user = {id: req.user.id};
        res.render('index',{
            user: user
        });
    } else {
        res.status(err.statusCode).send(err.message); // If shouldRedirect is not defined in our error, sends our original err data
    }
});



