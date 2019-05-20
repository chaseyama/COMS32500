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

/*
    Generate session using express-session module
*/
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

/*
    3rd Party Modules
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const expressValidator = require('express-validator');
app.use(expressValidator());

const bcrypt = require('bcrypt');
const path = require('path');
// const ejs = require('ejs');
app.set('view engine', 'ejs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/*
    Our Imported Modules
*/
const usersDb = require('./usersDatabase.js');
const market = require('./market.js');
const questions = require('./questions.js');
const responses = require('./responses.js');

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
});

/*
    Initialize Databases
*/
usersDb.createUserTable();
market.createMarketTable();
questions.createQuestionsTable();
responses.createResponsesTable();


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
    console.log(req.sessionID);
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
                                WEBSITE ROUTING
******************************************************************************
******************************************************************************/

app.get('/', function(req, res) {
    var user;
    if(req.user) user = req.user;
    else user = null;
    res.render('index',{
        user: user
    });
});
app.get('/index', function(req, res) {
    var user;
    if(req.user) user = req.user;
    else user = null;
    res.render('index',{
        user: user
    });
});

app.get('/login', function(req, res) {
    res.render('login', {
        error_message: null, 
        success_message: null,
        user: null
    });
});
app.get('/register', function(req, res) {
    res.render('register', {
        errorMessages: null,
        user: null
    });
});

app.get('/market', function(req, res){
    var user;
    if(req.user) user = req.user;
    else user = null;
    res.render('market', {
        browse: false, 
        browseResults: null,
        user: user
    });
});

app.get('/resources', function(req, res) {
    var user;
    if(req.user) user = req.user;
    else user = null;
    res.render('resources',{
        user: user
    });

});

app.get('/questions', function(req, res) {
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
});

app.get('/new_question', function(req, res) {
    res.render('new_question', {
        error_message: null, 
        success_message: null,
        user: null
    });
});

app.get('/profile', function(req, res) {
    var user;
    if(req.user) user = req.user;
    else user = null;
    res.render('profile',{
        success_message: null,
        user:user
    });
});

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_message', 'You are logged out');
  // res.redirect('login');
    res.render('login', { 
        success_message: req.flash('success_message'),
        user: null
    });
});

/******************************************************************************
******************************************************************************
    USER ACCOUNTS CODE
    - USER LOGIN
    - USER REGISTRATION
******************************************************************************
******************************************************************************/
passport.use(new LocalStrategy({passReqToCallback: true}, function(req, username, password, done) {
        console.log('Entering Local Strategy Login Method');
        usersDb.fetchUserByEmail(username, (error, user) => {
            if(error) throw error;
            if(!user){
                console.log('User not found');
                req.flash({error_message: 'Unknown user'});
                return done(null, false, { error_message: req.flash('error_message') });
            }else{
                console.log('User found, comparing passwords');
                usersDb.comparePassword(password, user[0].password, (error, isMatch) =>{
                    console.log('Password Comparison Result: ' + isMatch);
                    console.log(user[0]);
                    if(error) throw error;
                    if(isMatch){
                        console.log('About to return match');
                        req.flash({success_message: 'Successfully logged in'});
                        return done(null, user[0], { success_message: req.flash('success_message') });   
                    }else{
                        console.log('About to return fail');
                        req.flash({error_message: 'Incorrect password'});
                        return done(null, false, { error_message: req.flash('error_message') });
                    }
                });    

            }
        });    
    }
));


/***
    USER LOGIN
***/
app.post('/login_user', 
    passport.authenticate('local', {
        successRedirect: 'profile', 
        failureRedirect: 'login', 
        failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    usersDb.getUserById(id, function(error, user){
        done(error, user);
    });
});

/***
    REGISTER USER:
***/
app.post('/register_user', function (req, res) {
    console.log('Entering register_user method');
    console.log(req.body.email);
    /*
        User input sanitation using express-validator
        - Require first name
        - Check for valid email
        - Check password minimum length (8 characters) and that passwords match
    */

    req.check('email', 'Please enter a valid email address').isEmail();
    req.check('password','Password requirement: minimum 8 characters').isLength({min:8});
    req.check('confirmPassword','Password does not match').equals(req.body.password);
    var error = req.validationErrors();
    if(error){
        var errors = [];
        for(var i = 0; i < error.length; i++){
            errors.push(error[i].msg)
        }
        req.flash('error_message', errors);
        res.render('register', { 
            error_message: req.flash('error_message'),
            user: null
        });
    }
    else{
        usersDb.fetchUserByEmail(req.body.email, (error, rows) => {
            if(error) throw error;
            if(rows){
                req.flash('error_message', 'There is already an account associated with this email');
                res.render('register', {
                    error_message: req.flash('error_message'),
                    user: null
                });
            }else{
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(req.body.password, salt);

                var user = {'email': req.body.email,
                            'fname': req.body.fname,
                            'lname': req.body.lname,
                            'password': hashedPassword,
                            'salt': salt
                };
                usersDb.insertUser(user);
                
                //Redirect user
                var userItems = market.fetchUsersItems(1, (rows) => {
                    var msg = null; 
                    if(rows){
                        msg = rows;
                    }
                    req.flash('success_message', 'Your account has been successfully registered');
                    res.render('login', {
                        fname: req.body.fname,
                        myItems: msg,
                        success_message: req.flash('success_message'),
                        user: null
                    });
                });
            }
        });
    }
})

/***
    Marketplace Handlers
***/
//Search item
app.post('/find_item', function (req,res){
    console.log('Entering find_item method');
    console.log('Searching for item with category: ' + req.body.item_category + ' and price range: ' + req.body.item_price);
    var itemParameter = {
        'category': req.body.item_category,
        'priceRange': req.body.item_price
    };
    console.log(req.body.item_price);

    market.fetchItems(itemParameter,(rows) =>{
        if(rows){
            res.render('market', {browse: true, browseResults: rows,
        user: user});
        }else{
            res.render('market', {browse: true, browseResults: null,
        user: null});
        }
    });
})

//Insert new item
app.post('/sell_item', function (req,res){
    console.log('Entering insert new item method');

    //Calculate price range
    var priceRange;
    if(req.body.price <= 10){
        priceRange = '£';
    }else if(req.body.price > 10 && req.body.price <= 20){
        priceRange = '££';
    }else if(req.body.price > 20 && req.body.price <= 30){
        priceRange = '£££';
    }else{
        priceRange = '££££';
    }
    
    //Insert into database
    var newItem = {
        'itemName': req.body.itemName,
        'price': req.body.price,
        'priceRange': priceRange,
        'category': req.body.category,
        'description': req.body.description,
        'seller': req.body.seller
    };
    console.log(newItem);
    market.insertItem(newItem);
    //Redirect and how queried item
    res.render('market', {browse: false, browseResults: null,
        user: user});
    
})

/*
    Delete item
*/
app.post('/delete_items', function(req,res){
    console.log('Inside delete item function:');
    market.removeItem(req.body.delete,(rows) =>{
        if(rows){
            res.send('Item ' + req.body.delete + ' successfully deleted');
        }else{
            res.send('Error, item not deleted');
        }
    });

})

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









