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
	Query User's Items Method
	Description: Query  items from marketplace database that correspond to the userID
	Parameters: Object containing category and price values
*/
exports.fetchUsersItems = function(userId, callback){
    console.log('Searching for all items being sold by: ' + userId);
    var command = "SELECT * FROM market WHERE seller = ?;";
    db.serialize( () => {
        db.all(command, [userId], function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    console.log(rows);
                    callback(rows);
                }else{
                    console.log("No items for sale");
                    callback(null);
                }
            }
        });
    });
}
/*
	Query Item Method
	Description: Return specific item based on id
	Parameters: Integer representing item id
*/
exports.fetchItems = function(itemParameters, callback){
    console.log('Searching for all items');
    var command = "SELECT * FROM market WHERE category = ? AND priceRange = ?;";
    db.serialize( () => {
        db.all(command, [itemParameters['category'], itemParameters['priceRange']], function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    console.log(rows);
                    callback(rows);
                }else{
                    console.log("No items match this query");
                    callback(null);
                }
            }
        });
    });
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
exports.removeItem = function(itemId, callback){
    db.serialize(() => {
        var command = "DELETE FROM market WHERE id = ?";
        db.run(command, [itemId], function(error) {
            if (error) {
                console.log(error);
                callback(false);
            } else {
                console.log('Removed item: ' + itemId);
                callback(true);
            }
        });
    });
}













