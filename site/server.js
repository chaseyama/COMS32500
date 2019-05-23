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

/*
    Our Imported Modules
*/
const questions = require('./questions.js');
const responses = require('./responses.js');

/*
    Initialize Databases
*/
// users.createUserTable();
// market.createMarketTable();
// notification.createNotificationTable();
// questions.createQuestionsTable();
// responses.createResponsesTable();


// var newQuestion = {
//         'title': 'Whats the answer?',
//         'description': 'Id really like to know',
//         'category': 'general',
//         'author': '63'
//     };

// var newQuestion = {
//         'title': 'Where do I get soap?',
//         'description': 'Looking for the cheapest stores',
//         'category': 'supplies',
//         'author': '92'
//     };

// var newQuestion = {
//         'title': 'What time should I get up?',
//         'description': 'Im really not a morning person',
//         'category': 'general',
//         'author': '18'
//     };


// console.log(newQuestion);
// questions.insertQuestion(newQuestion);
// console.log(questions.fetchAllQuestions());
// questions.removeQuestion(2);
// questions.removeQuestion(5);
// questions.removeQuestion(6);
// questions.removeQuestion(7);
// questions.removeQuestion(10);

// var newResponse = {
//         'description': 'The answer is 42!',
//         'author': '98',
//         'questionId': '1'
//     };

// var newResponse = {
//         'description': 'Go to Tesco!',
//         'author': '76',
//         'questionId': '2'
//     };
// console.log(newResponse);
// responses.insertResponse(newResponse);
// responses.removeResponse(5);

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
var notification = require('./routers/notification.js');
var nav = require('./routers/nav.js');
app.use('/', users);
app.use('/', market);
app.use('/', notification);
app.use('/', nav);

app.get('/questions', function(req, res) {
    var user = null;
    if(req.user) user = req.user;
    questions.fetchAllQuestions((rows) =>{
        if(rows){
            res.render('questions', {browse: true, browseResults: rows,
        user: user});
        }else{
            res.render('questions', {browse: true, browseResults: null,
        user: user});
        }
    });
});

app.get('/new_question', function(req, res) {
    var user = null;
    if(req.user) user = req.user;
    if(user){
        res.render('new_question', {
            error_message: null, 
            success_message: null,
            user: user
        });
    }else{
        res.render('login', {
        error_message: null, 
        success_message: null,
        user: null
    });
    }
});

/***
    Question Handlers
***/
//Fetch questions by category
app.post('/fetch_by_category', function (req,res){
    console.log('Entering fetch_by_category method');
    console.log(req.body.category);
    var user;
    if(req.user) user = req.user;
    else user = null;
    questions.fetchQuestionsByCategory(req.body.category, (rows) =>{
        if(rows){
            res.render('questions', {browse: true, browseResults: rows,
        user: user});
        }else{
            res.render('questions', {browse: true, browseResults: null,
        user: user});
        }
    });
})

//Fetch question by id
app.get('/fetch_by_id', function (req,res){
    console.log('Entering fetch_by_id method');
    console.log(req.query.id);
    var user;
    if(req.user) user = req.user;
    else user = null;
    questions.fetchQuestionById(req.query.id, (rows) =>{
        var question = rows[0];
        responses.fetchResponsesByQuestionId(question.id, (rows) =>{
            if(rows){
                res.render('one_question', {
                    browse: true, 
                    question: question,
                    responses: rows,
                    user: user
                });
            }else{
                res.render('one_question', {
                    browse: true, 
                    browseResults: null,
                    question: question,
                    responses: null,
                    user: user
                });
            }
        });
    });
})

//Post new question
app.post('/post_question', function (req,res){
    console.log('Entering post_question method');
    
    //Insert into database
    var newQuestion = {
        'title': req.body.title,
        'description': req.body.description,
        'category': req.body.category,
        'author': req.body.author
    };
    console.log(newQuestion);
    questions.insertQuestion(newQuestion);
    //Redirect
    var user;
    if(req.user) user = req.user;
    else user = null;
    questions.fetchAllQuestions((rows) =>{
        if(rows){
            res.render('questions', {browse: true, browseResults: rows,
        user: user});
        }else{
            res.render('questions', {browse: true, browseResults: null,
        user: null});
        }
    });
    
})

//Delete question and it's responses
app.get('/delete_question', function (req,res){
    console.log('Entering delete_question method');
    questions.fetchQuestionById(req.query.id, (rows) =>{
        var question = rows[0];
        responses.removeResponsesByQuestionId(req.query.id, (rows) =>{
            questions.removeQuestion(req.query.id, (rows) =>{
                //Redirect
                    var user = null;
                    if(req.user) user = req.user;
                
                    questions.fetchAllQuestions((rows) =>{
                        if(rows){
                            res.render('questions', {browse: true, browseResults: rows,
                        user: user});
                        }else{
                            res.render('questions', {browse: true, browseResults: null,
                        user: null});
                        }
                    });
            });
        });
    });
    
})

/***
    Response Handlers
***/
//Post new response
app.post('/post_response', function (req,res){
    console.log('Entering post_response method');
    
    //Insert into database
    var newResponse = {
        'description': req.body.description,
        'author': req.body.author,
        'questionId': req.body.questionId
    };
    console.log(newResponse);
    responses.insertResponse(newResponse);
    //Redirect
    var user;
    if(req.user) user = req.user;
    else user = null;
    questions.fetchQuestionById(req.body.questionId, (rows) =>{
        var question = rows[0];
        responses.fetchResponsesByQuestionId(question.id, (rows) =>{
            if(rows){
                res.render('one_question', {
                    browse: true, 
                    question: question,
                    responses: rows,
                    user: user
                });
            }else{
                res.render('one_question', {
                    browse: true, 
                    browseResults: null,
                    question: question,
                    responses: null,
                    user: user
                });
            }
        });
    });
    
})

//Delete response by Id
app.get('/delete_response', function (req,res){
    console.log('Entering delete_response method');
    responses.removeResponse(req.query.id, (rows) =>{ 
    //Redirect
        var user = null;
        if(req.user) user = req.user;
    
        questions.fetchQuestionById(req.query.questionId, (rows) =>{
            var question = rows[0];
            responses.fetchResponsesByQuestionId(question.id, (rows) =>{
                if(rows){
                    res.render('one_question', {
                        browse: true, 
                        question: question,
                        responses: rows,
                        user: user
                    });
                }else{
                    res.render('one_question', {
                        browse: true, 
                        browseResults: null,
                        question: question,
                        responses: null,
                        user: user
                    });
                }
            });
        });
    });
})