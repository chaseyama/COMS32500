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


/*
    Our Imported Modules
*/
const usersDb = require('./usersDatabase.js');
const market = require('./market.js');

/*
    Initialize Databases
*/
usersDb.createUserTable();
market.createMarketTable();


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
    res.redirect("/index.html");
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



/*
    User Code:
    - User Login
    - User Registration
*/

/*
    Login User Method:
    - Need to add routing/error handling to front end if error exists
*/
app.post('/login_user', function (req, res) {
    console.log('Logging in user');
    /*
        Validate user input using express-validator
        - Check valid email
        - Check password minimum length (8 characters)
    */
    req.check('email', 'Invalid email address.').isEmail();
    req.check('password','Password not long enough').isLength({min:8});
    var errors = req.validationErrors();
    if(errors){
        ssn.errors = errors;
        res.sendFile(path.join(__dirname+'/public/login.html'));
    }

    /*
        Validate credentials against database
        - Check if password matches
        - Redirect to appropriate result
    */
    usersDb.fetchUser(req.body.email, (rows) => {
        if(rows){
            bcrypt.compare(req.body.password, rows[0].password, function(err, result){
                if(result === true){
                    //Save email as session variable
                    ssn = req.session;
                    ssn.email = req.body.email;
                    console.log(ssn.email);
                    //Redirect user
                    res.sendFile(path.join(__dirname+'/public/profile.html'));
                }else{
                    res.send('Incorrect password');
                }
            });
        }else{
            res.send('There is no registered user with this email.');
        }
    });
})

/*
    Register New User Method:
    - Need to add routing/error handling to front end if error exists
*/
app.post('/register_user', function (req, res) {
    console.log('Entering register_user method');

    /*
        User input validation using express-validator
        - Require first name
        - Check for valid email
        - Check password minimum length (8 characters) and that passwords match
    */
    req.check('email', 'Invalid email address.').isEmail();
    req.check('password','Password not long enough').isLength({min:8});
    req.check('password','Password does not match').equals(req.body.confirmPassword);
    var errors = req.validationErrors();
    if(errors){
        res.send(errors);
    }

    /*
        Check for existing user
    */
    usersDb.fetchUser(req.body.email, (rows) => {
        if(rows){
            res.send('An account with this email already exists. Please log in or register under a different email address.');
        }
    });

    /*
        Add new user to the database
        - Use bcrypt to hash password with salt
        - Redirect user to profile page
    */
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(req.body.password, salt);

    var user = {'email': req.body.email,
                'fname': req.body.fname,
                'lname': req.body.lname,
                'password': hashedPassword,
                'salt': salt
    };
    usersDb.insertUser(user);

    //Save Session
    ssn = req.session;
    ssn.email = req.body.email;
    ssn.fname = req.body.fname;
    
    //Redirect user
    res.sendFile(path.join(__dirname+'/public/profile.html'));
})

/*
    Marketplace Handlers
*/
//Search item
app.post('/find_item', function (req,res){
    console.log('Entering find_item method');
    console.log('Searching for item with category: ' + req.body.item_category + ' and price range: ' + req.body.item_price);
    var itemParameter = {
        'category': req.body.item_category,
        'priceRange': req.body.item_price
    };

    market.fetchItems(itemParameter,(rows) =>{
        if(rows){
            res.send(rows);
        }else{
            res.send('No items match that search category');
        }
    });
})

//Insert new item
app.post('/sell_item', function (req,res){
    console.log('Entering insert new item method');

    //Validate all fields are complete/wellformated
        //Description must be within character limit


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
    console.log('Exiting insert new item method');
})


















