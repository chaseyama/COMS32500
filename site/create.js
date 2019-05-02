"use strict";
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("users.db");

db.close();

//Create database
export.createDatabase = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS users (" +
          "'email' VARCHAR(255) PRIMARY KEY, " +
          "'fname' VARCHAR(255), " +
          "'lname' VARCHAR(255), " +
          "'password' VARCHAR(255));");

        console.log('successfully created the users table in data.db');
    });  
}
//Insert user into databse
export.insertUser = function(){
    var email = "barcelonafc@gmail.com";
    var fname = "Leo";
    var lname = "Messi";
    var password = "goal";

    db.serialize(() => {
        var command = "INSERT INTO USERS ('email', 'fname', 'lname', 'password') ";
        command += "VALUES (?, ?, ?, ?) ";
        db.run(command, [email, fname, lname, password], function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log("Added user");
            }
        });
    });
}
//Select All Users
export.selectUsers = function() {
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





