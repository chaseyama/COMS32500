"use strict";

/********************************************************************
*********************************************************************
*********************************************************************
    MARKETPLACE FILE:
    Route Handlers for Marketplace
*********************************************************************
*********************************************************************
********************************************************************/

const express = require("express");
const router = express.Router();
const users = require('./users_db.js');

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/*****************************************
    Register New User Route Handler
    Description: Sanitize user input then insert into database
*****************************************/

router.post('/register_user', function (req, res, next) {
    /******************
    Sanitize User Input
    ******************/
    console.log('Sanitizing User Input');
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
    }else{
        /******************
        Validate Against Database
        ******************/
        console.log('Checking User Email');
        console.log(req.body.email);
        users.fetchUserByEmail(req.body.email, (error, rows) => {
        		/******************
    		    Error: Email Already Registered
    		    ******************/
                if(rows.length != 0){
                    console.log(rows);
                    req.flash('error_message', 'There is already an account associated with this email');
                    res.render('register', {
                        error_message: req.flash('error_message'),
                        user: null
                    });
                }else{
                    /******************
        		    Sanitize User Input
        		    ******************/
                    console.log('Registering User');
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(req.body.password, salt);
                    var user = {'email': req.body.email,
                                'fname': req.body.fname,
                                'lname': req.body.lname,
                            	'password': hashedPassword
                    };

                    users.insertUser(user);  
                    /******************
            		Route User
            		******************/
                    req.flash('success_message', 'Your account has been successfully registered');
                    res.render('login', {
                            fname: req.body.fname,
                            success_message: req.flash('success_message'),
                            error_message: null,
                            user: null
                    });
                }   
        }); 
    }   
})

/*****************************************
    Login User Route Handler
    Description: Use PassportJS (Local-Strategy)
*****************************************/
router.post('/login_user', 
    passport.authenticate('local', {
        successRedirect: 'profile', 
        failureRedirect: 'login', 
        failureFlash: true}),
    function(req, res) {
        res.redirect('/');
});

/*****************************************
    PassportJS Local-Strategy Authentication Method
    Description: Definition of PassportJS (Local-Strategy)
*****************************************/
passport.use(new LocalStrategy({passReqToCallback: true}, function(req, username, password, done) {
        console.log('Password:' + password);
		/******************
    	Fetch User Information
    	******************/
        users.fetchUserByEmail(username, (error, user) => {
            if(error) throw error;
            /******************
	    	Error: User Not Found
	    	******************/
            console.log(user);
            if(user.length == 0){
                req.flash({error_message: 'Unknown user'});
                return done(null, false, { error_message: req.flash('error_message') });
            }else{
                /******************
    	    	Validate User Password
    	    	******************/
                users.comparePassword(password, user[0].password, (error, isMatch) =>{    
                    /******************
    		    	Successful Login
    		    	******************/
                    if(isMatch){
                        req.flash({success_message: 'Successfully logged in'});
                        return done(null, user[0], { success_message: req.flash('success_message') });   
                    }
    				/******************
    		    	Error: Incorrect Password
    		    	******************/
                    else{
                        req.flash({error_message: 'Incorrect password'});
                        return done(null, false, { error_message: req.flash('error_message') });
                    }
                }); 
            }     
        });    
    }
));

/*****************************************
    PassportJS (De)Serialize User Methods
*****************************************/
passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    users.getUserById(id, function(error, user){
        done(error, user);
    });
});

module.exports = router;