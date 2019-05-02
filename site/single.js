"use strict";
var sqlite = require("sqlite3");

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