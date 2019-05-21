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


/*****************************************
    Send Inquiry Route Handler
    Description: Create Inquiry
*****************************************/
router.get('/makeInquiry', function(req,res){
    var ownerId = req.query.owner;
    var itemName= req.query.itemName;
    var buyerId = req.query.buyer;
    //Get buyer email
    users.getEmailById(buyerId, (buyerName, email) =>{
        if(email){
            //Send message
            var msg = buyerName + " is interested in purchasing your " + itemName + ". You can contact him at " + email + ".";
            console.log(msg);
            notification.insertNotification(ownerId, msg, (result) =>{
                if(result){
                    req.flash('success_message', 'Request Sent');
                    res.render('market', {
                        success_message: req.flash('success_message'),
                        browse: false,
                        browseResults: null,
                        user: req.user
                    });
                }
            });
        }
    });
})

module.exports = router;