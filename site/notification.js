"use strict";

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

exports.createNotificationTable = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS notification (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " recipient INTEGER, " +
          " msg VARCHAR(255), " +
          " FOREIGN KEY (recipient) REFERENCES users (id));");

        console.log('successfully created the notification table in studyabroad.db');
    });  

}

exports.insertNotification = function(ownerId, msg, callback){
    db.serialize(() => {
        var command = "INSERT INTO notification ('recipient', 'msg') ";
        command += "VALUES (?,?);"
        console.log(command);
        console.log(ownerId + msg);
        db.run(command, [ownerId, msg], function(error){
            if(error){
                console.log('Error inserting notification');
                throw error;
                // callback(false);
            }
            else{
                console.log('successfully inserted notification');
                callback(true);
            }
        });
    });
}

exports.fetchNotificationsById = function(id, callback){
    db.serialize(() => {
        var command = "SELECT msg FROM notification WHERE recipient = ?";
        db.all(command, [id], function(error, rows){
            if(error) throw error;
            else callback(rows);
        });
    });
}

exports.deleteNotificationById = function(id, callback){
    db.serialize(() =>{
        var command = "DELETE FROM notification WHERE id = ?";
        db.run(command, [id], function(error){
            if(error) throw error;
            else callback(true);
        });
    });
}