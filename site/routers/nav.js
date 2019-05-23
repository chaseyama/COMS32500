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
const notification = require('./notification_db.js');

/*****************************************
    Index/Home Route Handler
*****************************************/
router.get('/', function(req, res) {
    var user = null;
    if(req.user) user = {id: req.user.id};
    res.render('index',{
        user: user
    });
});

/*****************************************
    Index/Home Route Handler
*****************************************/
router.get('/index', function(req, res) {
    var user = null;
    if(req.user) user = {id: req.user.id};;
    res.render('index',{
        user: user
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
    Profile Route Handler
*****************************************/
router.get('/profile', function(req, res) {
    market.fetchUsersItems(req.user.id, (rows) => {
        var items = null; 
        if(rows) items = rows;
        notification.fetchNotificationsById(req.user.id, (rows) =>{
            var notifications = null;
            if(rows.length != 0) notifications = rows;
            var user = {id: req.user.id};
            res.render('profile', {
                success_message: null,
                notifications: notifications,
                myItems: items,
                user: user
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

module.exports = router;