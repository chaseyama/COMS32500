"use strict";

/********************************************************************
*********************************************************************
*********************************************************************
    NOTIFICATION FILE:
    Route Handlers for User Notifications
*********************************************************************
*********************************************************************
********************************************************************/

const express = require("express");
const router = express.Router();
const notification = require('./notification_db.js');
const users = require('./users_db.js');
const market = require('./market_db.js');
const questions = require('./questions_db.js');


/*****************************************
    Send Inquiry Route Handler
    Description: Create Inquiry
*****************************************/
router.get('/makeInquiry', function(req,res){
    console.log('Adding Notification');
    var ownerId = req.query.owner;
    var itemName= req.query.itemName;
    var buyerId = req.query.buyer;
    //Get buyer email
    users.getEmailById(buyerId, (buyerName, email) =>{
        if(email){
            //Send message
            var msg = buyerName + " is interested in purchasing your " + itemName + ". You can contact him at " + email + ".";
            notification.insertNotification(ownerId, msg, (result) =>{
                if(result){
                    req.flash('success_message', 'Request Sent');
                    var user = {id: req.user.id};
                    res.render('market', {
                        success_message: req.flash('success_message'),
                        browse: false,
                        browseResults: null,
                        user: user
                    });
                }
            });
        }
    });
})

router.post('/deleteNotification', function(req, res){
    var notificationId = req.body.delete;
    console.log("Note id: " + notificationId);
    notification.deleteNotificationById(req.body.delete,(result) =>{
        if(result){
            req.flash('success_message', 'Your notification has been successfully deleted');
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
            req.flash('error_message', 'Your notification not has been deleted');
            res.send('Error, item not deleted');
        }
    });

})

module.exports = router;