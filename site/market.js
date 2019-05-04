"use strict";
/*
	This file contains the methods needed for the Marketplace aspect of the website.
*/

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

exports.createMarketTable = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS market (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " itemName VARCHAR(255), " +
          " price FLOAT (255), " +
          " priceRange VARCHAR(16), " +
          " description VARCHAR(255)) " + 
          " seller INTEGER " + 
          " FOREIGN KEY (seller) REFERENCES users (id);");
        // db.run("INSERT INTO USERS (email, fname, lname, password) VALUES ('bristol@gmail.com', 'John', 'Smith', 'password');");

        console.log('successfully created the marketplace table in studyabroad.db');
    });  

}

/*
	Description: Query all items from marketplace database that match the search criteria
	Parameters: Object containing category and price values
*/
exports.fetchItems = function(item){

}