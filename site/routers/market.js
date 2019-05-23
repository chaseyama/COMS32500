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
        if(req.user) user = req.user;
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
        'category': req.body.category,
        'description': req.body.description,
        'seller': req.user.id
    };

    market.insertItem(newItem);

    var user;
    if(req.user) user = req.user;
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
            var userItems = market.fetchUsersItems(req.user.id, (rows) => {
                var items = null; 
                if(rows){
                    items = rows;
                }
                res.render('profile', {
                    success_message: req.flash('success_message'),
                    notifications: null,
                    myItems: rows,
                    user: req.user
                });
            });
        }else{
            req.flash('error_message', 'Your item not has been deleted');
            res.send('Error, item not deleted');
        }
    });
})

module.exports = router;