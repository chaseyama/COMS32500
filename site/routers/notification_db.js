"use strict";

/********************************************************************
*********************************************************************
*********************************************************************
    NOTIFICATIONS FILE:
    CRUD Methods for Interacting with Notification Database
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
exports.createNotificationTable = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS notification (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " recipient INTEGER, " +
          " msg VARCHAR(255), " +
          " FOREIGN KEY (recipient) REFERENCES users (id));");
    });  

}

/*****************************************
    Insert Notification Method
    Parameter: INT User.id, STRING Message
    Description: Insert New Notification
*****************************************/
exports.insertNotification = function(ownerId, msg, callback){
    db.serialize(() => {
        var command = "INSERT INTO notification ('recipient', 'msg') ";
        command += "VALUES (?,?);"
        db.run(command, [ownerId, msg], function(error){
            if(error){
                throw error;
                // callback(false);
            }
            else{
                callback(true);
            }
        });
    });
}

/*****************************************
    Get Notifications by User Id Method
    Parameter: INT User.id
    Description: Display Notifications on Profile Page
*****************************************/
exports.fetchNotificationsById = function(id, callback){
    db.serialize(() => {
        var command = "SELECT msg FROM notification WHERE recipient = ?";
        db.all(command, [id], function(error, rows){
            if(error) throw error;
            else callback(rows);
        });
    });
}

/*****************************************
    Delete Notification by Notification Id Method
    Parameter: INT Notification.id
    Description: Delete Notifications
*****************************************/
exports.deleteNotificationById = function(id, callback){
    db.serialize(() =>{
        var command = "DELETE FROM notification WHERE id = ?";
        db.run(command, [id], function(error){
            if(error) throw error;
            else callback(true);
        });
    });
}