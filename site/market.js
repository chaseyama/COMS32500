"use strict";
/*
	This file contains the methods needed for the Marketplace aspect of the website.
*/

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

/*
	Create Marketplace Database Table
*/
exports.createMarketTable = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS market (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " itemName VARCHAR(255), " +
          " price FLOAT (255), " +
          " priceRange VARCHAR(16), " +
          " category VARCHAR(16), " + 
          " description VARCHAR(255), " + 
          " seller INTEGER, " + 
          " FOREIGN KEY (seller) REFERENCES users (id));");

        console.log('successfully created the marketplace table in studyabroad.db');
    });  

}

/*
	Fetch All Items Method
	Description: Query all items from marketplace database
*/
exports.fetchAllItems = function(){

}

/*
	Query Items Method
	Description: Query  items from marketplace database that match the search criteria
	Parameters: Object containing category and price values
*/
exports.fetchItems = function(item){

}
/*
	Query Item Method
	Description: Return specific item based on id
	Parameters: Integer representing item id
*/
exports.fetchItem = function(itemId){

}

/*
	Insert New Item Method
	Description: Add new item to the market table
	Parameters: Dictionary object containing item information
*/
exports.insertItem = function(item){
	db.serialize(() => {
		var command = "INSERT INTO market ('itemName', 'price', 'priceRange', 'category','description', 'seller') ";
        command += "VALUES (?, ?, ?, ?, ?, ?);";
        db.run(command, [item['itemName'], item['price'], item['priceRange'], item['category'], item['description'], item['seller']], function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Added new item' + item['itemName']);

                //Console check for add
                console.log('Checking added item')
                db.serialize(() => {
                    var command = "SELECT * FROM market";
                    var results = db.all(command, [], function(error,rows) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(rows);
                        }
                    });
                });
            }
        });
	});
}

/*
	Update Item Method
*/
exports.updateItem = function(item){

}

/*
	Remove Item Method
*/
exports.removeItem = function(item){

}












