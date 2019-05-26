"use strict";

/********************************************************************
    MARKETPLACE FILE:
    Route Handlers for Marketplace
********************************************************************/

/*****************************
Hide Results When Selling Item
*****************************/
var sell = document.querySelector("#sellTab");
sell.addEventListener('click', hideResults);

function hideResults(){
    var browseResults = document.querySelector("#browseResults");
    if(browseResults){
        document.querySelector("#browseResults").style.display = 'none';
    }
}

function getConfirmation(sellerId, itemName, buyerId){
    // document.querySelector(".confirmation");
    console.log('Confirmation Message');
    var message = 'Do you want to share your email with this item\'s owner? This will facilitate negotiation for the item.';
    if(window.confirm(message)){
        // //Generate and send HTTP request
        var xmlHttp = new XMLHttpRequest();
        var path = '/makeInquiry?owner=' + sellerId + '&itemName=' +itemName + '&buyer=' + buyerId;
        xmlHttp.open( "GET", path, true); // false for synchronous request
        xmlHttp.send( null );

        //Display Success Message
        var success_message = document.querySelector("#messages");
        success_message.innerHTML += ' <div class="alert alert-success">Notification delivered successfully</div>';
        window.scrollTo(0, 0);
    }else{
        console.log('Error');
    }
}