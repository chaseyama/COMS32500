"use strict";
const bcrypt = require('bcrypt');
/*
    Sqlite Methods for the Users Database
*/

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

/*
    Create Database Method
    Description: Create users table
*/
exports.createUserTable = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS users (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          "'email' VARCHAR(255), " +
          "'fname' VARCHAR(255), " +
          "'lname' VARCHAR(255), " +
          "'password' VARCHAR(255), " +
          "'salt' VARCHAR(255));");
        // db.run("INSERT INTO USERS (email, fname, lname, password) VALUES ('bristol@gmail.com', 'John', 'Smith', 'password');");

        console.log('successfully created the users table in data.db');
    });  

}

/*
    Insert New User Method
    Description: Add new user to the Users table
    Parameter: Dictionary object containing the user information
*/
exports.insertUser = function(userInfo){
    console.log('Entering insert user method');
    db.serialize(() => {
        var command = "INSERT INTO USERS ('email', 'fname', 'lname', 'password', 'salt') ";
        command += "VALUES (?, ?, ?, ?, ?);";
        db.run(command, [userInfo['email'], userInfo['fname'], userInfo['lname'], userInfo['password'], userInfo['salt']], function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log("Successfully added user, printing all users");
            }
        });
    });
}

/*
    Fetch Single User
    Description: Search for registered user using email
    Parameter: String containing the user's email
*/
exports.fetchUserByEmail = function(email, callback){
    var command = "SELECT * FROM USERS WHERE email = ? ;";
    db.serialize( () => {
        db.all(command, email, (error,rows) => {
            // if(error) throw error;
            if(rows.length != 0){
                console.log('Successfully queried user');
                callback(null, rows);
            }else{
                console.log("No user with that email exists");
                callback(error, null);
            }
        });
    });
}

/*
    Fetch User Password
    Description: Search for registered user using email
    Parameter: String containing the user's email
*/
exports.comparePassword = function(password, userPassword, callback){
    bcrypt.compare(password, userPassword, function(err, result){
        if(err) throw err;
        callback(null, result);
    })
}

exports.getUserById = function(id, callback){
    var command = "SELECT * FROM USERS WHERE id = ?";
    db.serialize(() =>{
        db.all(command, id, (error, rows) =>{
            if(error) throw error;
            callback(error, rows[0]);
        });

    });
}

/*
    Select All Users
    Description: Query all registered users information and print to the command line
*/
exports.selectUsers = function() {
    db.serialize(() => {
        var command = "SELECT * FROM USERS";
        var results = db.all(command, [], function(error,rows) {
            if (error) {
                console.log(error);
            } else {
                console.log(rows);
            }
        });
    });
}


