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

//Import CRUD Methods
const users = require('./users.js');
const market = require('./market.js');
const notification = require('./notification.js');
const questions = require('./questions.js');
const responses = require('./responses.js');

/*****************************************
    Create Tables Method
*****************************************/
function createTables(){
	//Create Tables
	users.createUsersTable();
	market.createMarketTable();
	notification.createNotificationTable();
	questions.createQuestionsTable();
	responses.createResponsesTable();

	//Populate Tables
	populateUsers();
	populateMarket();
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
	var description = ['Used down jacket', 'Stinky shoes', 'Used pillows', 'Old sheets', 'Wooden desk chair', 'Wooden bed frame', '3 pots, 2 pans, different sizes', '5 knives', 'iPhone Adapter', 'Macbook Pro 13 inch', 'Special beans, water daily'];
	var seller = [1,2,1,2,1,2,1,2,1,2,1];
	for(var i =0; i < 11, i++){
		var item ={
			itemName: itemName[i];
			price: price[i];
			priceRange: priceRange[i];
			description: description[i];
			seller: seller[i];
		}
		market.insertItem(item);
	}
}