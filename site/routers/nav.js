"use strict";
/********************************************************************
*********************************************************************
*********************************************************************
    NAVIGATION FILE:
    Route Handlers for Basic Navigation
*********************************************************************
*********************************************************************
********************************************************************/

const express = require("express");
const router = express.Router();

const market = require('./market_db.js');
const questions = require('./questions_db.js');
const notification = require('./notification_db.js');

/*****************************************
    Index/Home Route Handler
*****************************************/
router.get('/', function(req, res) {
    var user = null;
    if(req.user) user = {id: req.user.id};
    res.render('index',{
        error_message: null,
        user: user,
        first_visit: false
    });
});

/*****************************************
    Index/Home Route Handler
*****************************************/
router.get('/index', function(req, res) {
    var user = null;
    if(req.user) user = {id: req.user.id};;
    res.render('index',{
        error_message: null,
        user: user,
        first_visit: false
    });
});

/*****************************************
    Login Route Handler
*****************************************/
router.get('/login', function(req, res) {
    res.render('login', {
        error_message: null, 
        success_message: null,
        user: null
    });
});

/*****************************************
    Register Route Handler
*****************************************/
router.get('/register', function(req, res) {
    res.render('register', {
        error_message: null,
        user: null
    });
});

/*****************************************
    Market Route Handler
*****************************************/
router.get('/market', function(req, res){
    var user = null;
    if(req.user) user = {id: req.user.id};
    res.render('market', {
        success_message: null,
        browse: false, 
        browseResults: null,
        user: user
    });
});

/*****************************************
    Resources Route Handler
*****************************************/
router.get('/resources', function(req, res) {
    var user = null;
    if(req.user) user = {id: req.user.id};
    res.render('resources',{
        user: user
    });
});

/*****************************************
    Questions Route Handler
*****************************************/
router.get('/questions', function(req, res) {
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

/*****************************************
    New Question Route Handler
*****************************************/
router.get('/new_question', function(req, res) {
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

/*****************************************
    Profile Route Handler
*****************************************/
router.get('/profile', function(req, res) {
    market.fetchUsersItems(req.user.id, (rows) => {
        var items = null; 
        if(rows) items = rows;

        questions.fetchUsersQuestions(req.user.id, (rows) => {
            var questions = null; 
            if(rows) questions = rows;
            notification.fetchNotificationsById(req.user.id, (rows) =>{
                var notifications = null;
                if(rows.length != 0) notifications = rows;
                console.log(notifications);
                res.render('profile', {
                    success_message: null,
                    notifications: notifications,
                    myItems: items,
                    myQuestions: questions,
                    user: req.user
                });

            });
        });
    });
});

/*****************************************
    Logout Route Handler
*****************************************/
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_message', 'You are logged out');
    res.render('login', { 
        success_message: req.flash('success_message'),
        error_message: null,
        user: null
    });
});

/*****************************************
    Error Route Handler
*****************************************/
router.get('*', function(req, res, next) {
  let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`); // Tells us which IP tried to reach a particular URL
  err.statusCode = 404;
  err.shouldRedirect = true; //New property on err so that our middleware will redirect
  req.flash('error_message', 'Invalid URL');
  next(err);
});

module.exports = router;