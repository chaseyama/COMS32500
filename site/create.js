"use strict";

/*
    
*/

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("users.db");

/*
    Create Database Method
    Description: Create users table
*/
exports.createDatabase = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS users (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          "'email' VARCHAR(255), " +
          "'fname' VARCHAR(255), " +
          "'lname' VARCHAR(255), " +
          "'password' VARCHAR(255));");

        console.log('successfully created the users table in data.db');
    });  

}

/*
    Insert New User Method
    Description: Add new user to the Users table
    Parameter: Dictionary object containing the user information
*/
exports.insertUser = function(userInfo){
    db.serialize(() => {
        var command = "INSERT INTO USERS ('email', 'fname', 'lname', 'password') ";
        command += "VALUES (?, ?, ?, ?);";
        db.run(command, [userInfo['email'], userInfo['fname'], userInfo['lname'], userInfo ['password']], function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log("Added user");
            }
        });
    });
}

/*
    Fetch Single User
    Description: Search for registered user using email
    Parameter: String containing the user's email
*/
exports.fetchUser = function(email){
    db.serialize( () => {
        var command = "SELECT * FROM USERS WHERE email = ? ;";
        db.get(command, email, function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows){
                    console.log(rows);
                }else{
                    console.log("No user with that email exists");
                }
            }
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
        // console.log(results);
    });
}


