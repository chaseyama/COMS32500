"use strict";
/********************************************************************
*********************************************************************
*********************************************************************
    MARKETPLACE DATABASE FILE:
    CRUD Methods for Interacting with Market Database
    Database Method SQLite
*********************************************************************
*********************************************************************
********************************************************************/

//Instantiate Database Connection Using SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

/*****************************************
    Create Users Table Method
*****************************************/
exports.createMarketTable = function() {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS market (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " itemName VARCHAR(255), " +
          " price FLOAT (255), " +
          " priceRange VARCHAR(16), " +
          " category VARCHAR(16), " + 
          " description VARCHAR(255), " + 
          " seller INTEGER, " + 
          " FOREIGN KEY (seller) REFERENCES users (id));");
    });  
}

/*****************************************
    Insert Items Method
    Parameter: Item Object
    Description: Insert New Item
*****************************************/
exports.insertItem = function(item){
    db.serialize(() => {
        var command = "INSERT INTO market ('itemName', 'price', 'priceRange', 'category', 'description', 'seller') ";
        command += "VALUES (?, ?, ?, ?, ?, ?);";
        db.run(command, [item['itemName'], item['price'], item['priceRange'], item['category'], item['description'], item['seller']], function(error) {
            if (error) console.log(error) ;
            else {
                // console.log('Added new item: ' + item['itemName']);
            }
        });
    });
}

/*****************************************
    Delete Items Method
    Parameter: INT Item.id
    Description: Delete New Item
*****************************************/
exports.removeItem = function(itemId, callback){
    db.serialize(() => {
        var command = "DELETE FROM market WHERE id = ?";
        db.run(command, [itemId], function(error) {
            if (error)callback(false);
            else {
                callback(true);
            }
        });
    });
}

/*****************************************
    Get Items by User Method
    Parameter: INT User.id
    Description: Display User's items on Profile page
*****************************************/
exports.fetchUsersItems = function(userId, callback){
    var command = "SELECT * FROM market WHERE seller = ?;";
    db.serialize( () => {
        db.all(command, [userId], function(error,rows){
            if(error) throw error;
            if(rows.length != 0){
                callback(rows);
            }else{
                callback(null);
            }
        });
    });
}

/*****************************************
    Get Items By Category and PriceRange Method
    Parameter: Item Object[STRING Category, STRING PriceRange]
    Description: Query Marketplace Items
*****************************************/
exports.fetchItems = function(itemParameters, callback){
    var command;
    if(!itemParameters['category'] && !itemParameters['priceRange']){
        console.log('Query All');
        command = "SELECT * FROM market;";
        db.serialize( () => {
            db.all(command, function(error,rows){
                if(error) throw error;
                if(rows.length != 0){
                    callback(rows);
                }else{
                    callback(null);
                }
            });
        });
    }else if(!itemParameters['category'] && itemParameters['priceRange']){
        console.log('Query Price');
        command = "SELECT * FROM market WHERE priceRange = ?;";
        db.serialize( () => {
            db.all(command, [itemParameters['priceRange']], function(error,rows){
                if(error) throw error;
                if(rows.length != 0){
                    callback(rows);
                }else{
                    callback(null);
                }
            });
        });
    }else if(itemParameters['category'] && !itemParameters['priceRange']){
        console.log('Query Category');
        command = "SELECT * FROM market WHERE category = ?;";
        db.serialize( () => {
            db.all(command, [itemParameters['category']], function(error,rows){
                if(error) throw error;
                if(rows.length != 0){
                    callback(rows);
                }else{
                    callback(null);
                }
            });
        });
    }else{
        command = "SELECT * FROM market WHERE category = ? AND priceRange = ?;";
        console.log('Query Price and Category');
        console.log(itemParameters['category'] + " " + itemParameters['priceRange']);
        db.serialize( () => {
            db.all(command, [itemParameters['category'], itemParameters['priceRange']], function(error,rows){
                if(error) throw error;
                if(rows.length != 0){
                    callback(rows);
                }else{
                    callback(null);
                }
            });
        });
    }
}













