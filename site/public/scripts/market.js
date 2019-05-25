"use strict";

/********************************************************************
*********************************************************************
*********************************************************************
    MARKETPLACE FILE:
    Route Handlers for Marketplace
*********************************************************************
*********************************************************************
********************************************************************/

function getConfirmation(sellerId, itemName, buyerId){
    var message = 'Study Abroad Bristol can share your email with this item\'s owner to coordinate future inquiries. Do you want Study Abroad Bristol to share your email?';
    if(window.confirm(message)){
        var xmlHttp = new XMLHttpRequest();
        var path = '/makeInquiry?owner=' + sellerId + '&itemName=' +itemName + '&buyer=' + buyerId;
        xmlHttp.open( "GET", path, true); // false for synchronous request
        xmlHttp.send( null );
        document.getElementById('messages').innerHTML += ' <div class="alert alert-success">Notification delivered successfully</div>';
        window.scrollTo(0, 0);
    }else{
        console.log('False');
    }
}