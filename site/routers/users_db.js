"use strict";

/********************************************************************
*********************************************************************
*********************************************************************
    USER ACCOUNTS FILE:
    CRUD Methods for Interacting with Users Database
    Database Method SQLite
*********************************************************************
*********************************************************************
********************************************************************/

//Instantiate Database Connection Using SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");
const bcrypt = require('bcrypt');

/*****************************************
    Create Users Table Method
*****************************************/
exports.createUserTable = function() {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS users (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " email VARCHAR(255), " +
          " fname VARCHAR(255), " +
          " lname VARCHAR(255), " +
          " password  VARCHAR(255))");
    });  
}

/*****************************************
    Insert New User Method
    Parameter: Object containing user information
*****************************************/
exports.insertUser = function(userInfo){
    var command = "INSERT INTO USERS ('email', 'fname', 'lname', 'password', 'salt') ";
    command += "VALUES (?, ?, ?, ?, ?);";
    db.serialize(() => {
        db.run(command, [userInfo['email'], userInfo['fname'], userInfo['lname'], userInfo['password'], userInfo['salt']], function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log("Successfully added user, printing all users");
            }
        });
    });
}

/*****************************************
    Get User By Email Method
    Parameter: Object containing User email
    Description: Used for PassportJS Local Strategy
*****************************************/
exports.fetchUserByEmail = function(email, callback){
    var command = "SELECT * FROM USERS WHERE email = ? ;";
    db.serialize( () => {
        db.all(command, email, (error,rows) => {
            if(rows.length != 0){
                callback(null, rows);
            }else{
                callback(error, null);
            }
        });
    });
}

/*****************************************
    Authenticate User Password Method
    Parameter: String containing password
    Description: Used for PassportJS Local Strategy
*****************************************/
exports.comparePassword = function(password, userPassword, callback){
    bcrypt.compare(password, userPassword, function(err, result){
        if(err) throw err;
        callback(null, result);
    })
}

/*****************************************
    Get User By Id Method
    Parameter: String containing password
    Description: Used for PassportJS Local Strategy
*****************************************/
exports.getUserById = function(id, callback){
    var command = "SELECT * FROM USERS WHERE id = ?";
    db.serialize(() =>{
        db.all(command, id, (error, rows) =>{
            if(error) throw error;
            callback(error, rows[0]);
        });
    });
}

/*****************************************
    Get User Email By Id Method
    Parameter: Int containing User.id
    Description: Used for Notifications
*****************************************/
exports.getEmailById = function(userId, callback){
    var command = "SELECT email, fname FROM USERS WHERE id = ?";
    db.serialize(() => {
        db.all(command, userId, (error, rows) =>{
            if(error) throw error;
            var email = rows[0].email;
            var fname = rows[0].fname;
            callback(fname, email);
        });

    });
}

