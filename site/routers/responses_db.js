"use strict";
/********************************************************************
*********************************************************************
*********************************************************************
    RESPONSES DATABASE FILE:
    CRUD Methods for Interacting with Responses Database
    Database Method SQLite
*********************************************************************
*********************************************************************
********************************************************************/

//Instantiate Database Connection Using SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

/*****************************************
    Create Responses Table Method
*****************************************/
exports.createResponsesTable = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS responses (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " description VARCHAR(255), " +
          " author INTEGER, " +
          " questionId INTEGER, " +
          " FOREIGN KEY (questionId) REFERENCES questions (id), " +
          " FOREIGN KEY (author) REFERENCES users (id));");
    });  

}

/*****************************************
    Get Responses By Question Id Method
    Parameter: INT questionId
    Description: Return specific Responses based on questionId
*****************************************/
exports.fetchResponsesByQuestionId = function(questionId, callback){
    var command = "SELECT responses.id, responses.description, responses.author, " +
                " responses.questionId, users.fname " +
                " FROM responses JOIN users ON responses.author=users.id" +
                " WHERE responses.questionId = ?;";
    db.serialize( () => {
        db.all(command, [questionId], function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    callback(rows);
                }else{
                    console.log("No responses match this questionId");
                    callback(null);
                }
            }
        });
    });
}

/*****************************************
    Insert Response Method
    Parameter: Response Object
    Description: Add new Response to the Responses table
*****************************************/
exports.insertResponse = function(response){
    db.serialize(() => {
        var command = "INSERT INTO responses ('description', 'author', 'questionId') ";
        command += "VALUES (?, ?, ?);";
        db.run(command, [response['description'], response['author'], response['questionId']], function(error) {
            if (error) {
                console.log(error);
            } else {
                //Console check for add
                db.serialize(() => {
                    var command = "SELECT * FROM responses";
                    var results = db.all(command, [], function(error,rows) {
                        if (error) {
                            console.log(error);
                        }
                    });
                });
            }
        });
    });
}

/*****************************************
    Delete Response Method
    Parameter: INT responseId
    Description: Delete Response
*****************************************/
exports.removeResponse = function(responseId, callback){
    db.serialize(() => {
        var command = "DELETE FROM responses WHERE id = ?";
        db.run(command, [responseId], function(error) {
            if (error) {
                console.log(error);
                callback(false);
            } else {
                callback(true);
            }
        });
    });
}

/*****************************************
    Delete Response By Question Id Method
    Parameter: INT questionId
    Description: Deletes specific Responses based on questionId
*****************************************/
exports.removeResponsesByQuestionId = function(questionId, callback){
    db.serialize(() => {
        var command = "DELETE FROM responses WHERE questionId = ?";
        db.run(command, [questionId], function(error) {
            if (error) {
                console.log(error);
                callback(false);
            } else {
                callback(true);
            }
        });
    });

}
