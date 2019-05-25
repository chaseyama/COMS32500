"use strict";

/********************************************************************
*********************************************************************
*********************************************************************
    DATABASE FILE:
    Create Table Methods for Starting Web Application
    Database Method SQLite
*********************************************************************
*********************************************************************
********************************************************************/

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");
const bcrypt = require('bcrypt');

//Import CRUD Methods
const users = require('./routers/users_db.js');
const market = require('./routers/market_db.js');
const notification = require('./routers/notification_db.js');
const questions = require('./routers/questions_db.js');
const responses = require('./routers/responses_db.js');

// createTables();
printTables();

/*****************************************
    Create Tables Method
*****************************************/
function createTables(){
	try{
		//Create Tables
		users.createUserTable();
		market.createMarketTable();
		notification.createNotificationTable();
		questions.createQuestionsTable();
		responses.createResponsesTable();

		//Populate Tables
		// populateUsers();
		// populateMarket();
		populateNotification();
		db.close();
	}catch(error){
		console.log(error);
		db.close();
	}
}


/*****************************************
    Populate Users Table Method
*****************************************/
function populateUsers(){
	var email = ['admin@gmail.com', 'smith@gmail.com', 'mary@gmail.com'];
	var fname = ['admin', 'John', 'Mary'];
	var lname = ['admin', 'Smith', null];
	var password = ['adminadmin', 'password', 'pa55word'];
	var salt;
	var hashedPassword;
	var user;

	for(var i = 0; i < 3; i++){
		salt = bcrypt.genSaltSync(10);
	    hashedPassword = bcrypt.hashSync(password[i], salt);
	    user = {
	    	email: email[i],
	    	fname: fname[i],
	    	lname: lname[i],
	    	password: hashedPassword
	    } 
	    users.insertUser(user);
    }
}

/*****************************************
    Populate Market Table Method
*****************************************/
function populateMarket(){
	var itemName = ['Winter Jacket', 'Vans Shoes', '2 Pillows', 'Bed Sheets', 'Desk Chair', 'Bed Frame', 'Various Pots and Pans', 'Knife Set', 'iPhone Charger', 'Macbook Pro', 'Magic Beans'];
	var price = [12.5, 5, 7, 3, 15, 30, 5, 20, 1, 100, 999];
	var priceRange = ['££', '£', '£', '£', '££', '£££', '£', '££', '£', '££££', '££££'];
	var category = ['clothing', 'clothing', 'bedding', 'bedding', 'furniture', 'furniture', 'kitchenware', 'kitchenware', 'electronics', 'electronics', 'electronics', 'other'];
	var description = ['Used down jacket', 'Stinky shoes', 'Used pillows', 'Old sheets', 'Wooden desk chair', 'Wooden bed frame', '3 pots, 2 pans, different sizes', '5 knives', 'iPhone Adapter', 'Macbook Pro 13 inch', 'Special beans, water daily'];
	var seller = [1,1,1,1,1,1,2,2,2,2,2];
	for(var i =0; i < 11; i++){
		var item ={
			itemName: itemName[i],
			price: price[i],
			priceRange: priceRange[i],
			category: category[i],
			description: description[i],
			seller: seller[i]
		}
		market.insertItem(item);
	}
}

/*****************************************
    Populate Notification Table Method
*****************************************/
function populateNotification(){
	var recipient = [1,1,2,2,2];
	var buyerName = ['John','John','admin','admin','admin'];
	var itemName = ['Winter Jacket', 'Vans Shoes','iPhone Charger', 'Macbook Pro', 'Magic Beans'];
	var email = ['smith@gmail.com','smith@gmail.com','smith@gmail.com','admin@gmail.com','admin@gmail.com'];
	var msg;

	for(var i =0; i < 5; i++){
		msg = buyerName[i] + " is interested in purchasing your " + itemName[i] + ". You can contact him at " + email[i] + ".";
		notification.insertNotification(recipient[i], msg, () => {});
	}
}

/*****************************************
    Print All Tables Method
*****************************************/
function printTables(){
	//Print Users Table
	db.serialize(() => {
        db.all("SELECT * FROM users;", (error,rows) => {
	        if(rows){
	            console.log(rows);
	        }else{
	            console.log(error);
   			}
   		});
    });
    // //Print Market Table
    // db.serialize(() => {
    //     db.all("SELECT * FROM market;", (error,rows) => {
	   //      if(rows){
	   //          console.log(rows);
	   //      }else{
	   //          console.log(error);
   	// 		}
   	// 	});
    // });  
    // //Print Notification Table
    // db.serialize(() => {
    //     db.all("SELECT * FROM notification;", (error,rows) => {
	   //      if(rows){
	   //          console.log(rows);
	   //      }else{
	   //          console.log(error);
   	// 		}
   	// 	});
    // });  
}
