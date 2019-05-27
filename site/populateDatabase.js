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

/*****************************************
    Create Tables Method
*****************************************/
exports.createTables = function(){
	try{
		//Create Tables
		users.createUserTable();
		market.createMarketTable();
		notification.createNotificationTable();
		questions.createQuestionsTable();
		responses.createResponsesTable();
		db.close();
	}catch(error){
		console.log(error);
		db.close();
	}
}
/*****************************************
    Populate Tables Method
*****************************************/
exports.populateTables = function(){
	db.serialize( () => {
        db.all("SELECT * FROM USERS;", function(error,rows){
            if(error) throw error;
            if(rows.length != 0){
                callback(null);
            }else{
				populateUsers((finished) => {
					if(finished){
						populateMarket((finished) =>{
							if(finished){
								populateNotification((finished) => {
									
								});
							}
						});
					}
				});
            }
        });
    }); 
	try{
		
		db.close();
	}catch(error){
		console.log(error);
		db.close();
	}
}


/*****************************************
    Populate Users Table Method
*****************************************/
exports.populateUsers = function(){
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
exports.populateMarket = function (){
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
exports.populateNotification = function(){
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
    Populate Questions Table Method
*****************************************/
exports.populateQuestions = function(){
	var title = ["Where to buy Crest toothpaste?",
		"How does the grading system work in the UK?",
		"What's the best way to get to Bristol Airport?",
		"Best place to get a haircut?",
		"Is the food from Source actually good?",
		"How many bags can you take with easyJet?"];
	var description = ["I checked Sainsbury's, Tesco and Wilko, but I can't seem to find Crest toothpaste anywhere. Do they sell Crest in the UK, and if so, where?",
		"I'm an exchange student from the US, and I'm trying to figure out how the grading here compares to the US. Also, if someone could give me the link to a grade conversion chart, I would greatly appreciate it.",
		"I'm living in the North Village and I need to be at the airport by 6am Friday morning. What's the best way of getting there that early in the morning?",
		"Looking for the best place to get a guy's haircut for under £20.",
		"I've seen people get coffee there, but is the food any good?",
		"I'm flying with easyJet next weekend, and I'm trying to figure out how many bags I can take, and how heavy they can be."];
	var category = ['supplies', 'academics', 'travel', 'general', 'general', 'travel'];
	var author = [1,1,1,2,2,2];
	for(var i =0; i < 6; i++){
		var question ={
			title: title[i],
			description: description[i],
			category: category[i],
			author: author[i]
		}
		questions.insertQuestion(question);
	}
}

/*****************************************
    Populate Responses Table Method
*****************************************/
exports.populateResponses = function(){
	var description = ["Unfortunately, they don't sell Crest in the UK.",
		"If you've got to leave that early in the morning, I'd take an Uber just to be safe. They're not that expensive.",
		"You should try Men's Cave Barber! I think my haircut was about £12 last time I went.",
		"Eh, I'd try to avoid it if I were you.",
		"I tried it yesterday and it honestly wasn't that bad!",
		"I think you get one carry-on and one personal item, but check their website for the maximum weights."];
	var author = [2,2,1,1,2,1];
	var questionId = [1,3,4,5,5,6];
	for(var i =0; i < 6; i++){
		var response ={
			description: description[i],
			author: author[i],
			questionId: questionId[i]
		}
		responses.insertResponse(response);
	}
}

/*****************************************
    Print All Tables Method
*****************************************/
exports.printTables = function(){
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
    //Print Market Table
    db.serialize(() => {
        db.all("SELECT * FROM market;", (error,rows) => {
	        if(rows){
	            console.log(rows);
	        }else{
	            console.log(error);
   			}
   		});
    });  
    //Print Notification Table
    db.serialize(() => {
        db.all("SELECT * FROM notification;", (error,rows) => {

	        if(rows){
	            console.log(rows);
	        }else{
	            console.log(error);
   			}
   		});
    });
    //Print Questions Table
    db.serialize(() => {
        db.all("SELECT * FROM questions;", (error,rows) => {

	        if(rows){
	            console.log(rows);
	        }else{
	            console.log(error);
   			}
   		});
    });
    //Print Responses Table
    db.serialize(() => {
        db.all("SELECT * FROM responses;", (error,rows) => {

	        if(rows){
	            console.log(rows);
	        }else{
	            console.log(error);
   			}
   		});
    });   
}
