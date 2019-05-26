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
const market = require('./market_db.js');
const notification = require('./notification_db.js');
const questions = require('./questions_db.js');

/*****************************************
    Query Items Route Handler
    Description: Search for items on Marketplace Page
*****************************************/
router.post('/find_item', function (req,res){
    var itemParameter = {
        'category': req.body.item_category,
        'priceRange': req.body.item_price
    };
    market.fetchItems(itemParameter,(rows) =>{
        var user;
        if(req.user) user = {id: req.user.id};
        else user = null;
        if(rows){
            res.render('market', {
                success_message: null,
                browse: true, 
                browseResults: rows,
                user: user
            });
        }else{
            res.render('market', {
                success_message: null,
                browse: true, 
                browseResults: null,
                user: user
            });
        }
    });
})

/*****************************************
    Insert Item Route Handler
    Description: Insert item on Marketplace Page
*****************************************/
router.post('/sell_item', function (req,res){
    //Calculate Price Range
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

    //Create Item Object
    var newItem = {
        'itemName': req.body.itemName,
        'price': req.body.price,
        'priceRange': priceRange,
        'category': req.body.item_category,
        'description': req.body.description,
        'seller': req.user.id
    };

    //Insert Item
    market.insertItem(newItem);

    var user;
    if(req.user) user = {id: req.user.id};
    else user = null;
    req.flash('success_message', 'Your item has been successfully listed on the market');
    res.render('market', {
        success_message: req.flash('success_message'),
        browse: false, 
        browseResults: null,
        user: user
    });
})

/*****************************************
    Delete Item Route Handler
    Description: Delete item
*****************************************/
router.post('/delete_items', function(req,res){
    console.log('Inside delete item function:');
    market.removeItem(req.body.delete,(rows) =>{
        if(rows){
            req.flash('success_message', 'Your item has been successfully deleted');
            market.fetchUsersItems(req.user.id, (rows) => {
                var items = null; 
                if(rows) items = rows;
                questions.fetchUsersQuestions(req.user.id, (rows) => {
                    var questions = null; 
                    if(rows) questions = rows;
                    notification.fetchNotificationsById(req.user.id, (rows) =>{
                        var notifications = null;
                        if(rows) notifications = rows;
                        var user = {id: req.user.id};
                        res.render('profile', {
                            success_message: req.flash('success_message'),
                            notifications: notifications,
                            myItems: items,
                            myQuestions: questions,
                            user: user
                        });
                    });
                });
            });
        }else{
            req.flash('error_message', 'Your item not has been deleted');
            res.send('Error, item not deleted');
        }
    });
})

module.exports = router;