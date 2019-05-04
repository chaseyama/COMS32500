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
app.use("/index.html", auth);
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
    res.redirect("/login.html");
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
    - User Validation (Check login credentials then redirect to login page)
    - User Registration
*/

//Login User
app.post('/login_user', function (req, res) {
    //Validate user input
    req.check('email', 'Invalid email address.').isEmail();
    req.check('password','Password not long enough').isLength({min:6});
    if(errors){
        res.send(errors);
    }
    //Compare to database values


})


//Register New User
app.post('/register_user', function (req, res) {
    console.log('Entering register_user method');

    //Validate user input
    req.check('email', 'Invalid email address.').isEmail();
    req.check('password','Password not long enough').isLength({min:6});
    req.check('password','Password does not match').equals(req.body.confirmPassword);
    var errors = req.validationErrors();

    if(errors){
        res.send(errors);
    }
    //Check if user exists
    // var query = usersDb.fetchUser(req.body.email);
    // if(query){
    //     res.send(query);
    // }else{
    //     res.send('Nothing found');
    // }
    

    //Add new user
    var user = {'email': req.body.email,
                'fname': req.body.fname,
                'lname': req.body.lname,
                'password': req.body.password
    };
    usersDb.insertUser(user);
    //Redirect user
    res.send('Successfully registered new user')

})

/*
    Marketplace Handlers
*/
//Search item
app.post('/find_item', function (req,res){
    console.log('Entering find_item method');

    console.log(req.body.item_category + ' ' + req.body.item_price);

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


















