"use strict";
/*
	This file contains the methods needed for the Q&A aspect of the website.
*/

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

/*
	Create Respsonses Database Table
*/
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

        console.log('successfully created the responses table in studyabroad.db');
    });  

}

/*
    Query Responses Method
    Description: Return specific responses based on questionId
    Parameters: Integer representing questionId
*/
exports.fetchResponsesByQuestionId = function(questionId, callback){
    console.log('Fetching responses with questionId: ' + questionId);
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
                    console.log(rows);
                    callback(rows);
                }else{
                    console.log("No responses match this questionId");
                    callback(null);
                }
            }
        });
    });
}

/*
	Insert New Response Method
	Description: Add new response to the responses table
	Parameters: Dictionary object containing response information
*/
exports.insertResponse = function(response){
	db.serialize(() => {
		var command = "INSERT INTO responses ('description', 'author', 'questionId') ";
        command += "VALUES (?, ?, ?);";
        db.run(command, [response['description'], response['author'], response['questionId']], function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Added new response ' + response['description']);

                //Console check for add
                console.log('Checking added response')
                db.serialize(() => {
                    var command = "SELECT * FROM responses";
                    var results = db.all(command, [], function(error,rows) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(rows);
                        }
                    });
                });
            }
        });
	});
}

/*
	Update Response Method
*/
exports.updateResponse = function(item){

}

/*
	Remove Response Method
*/
exports.removeResponse = function(responseId, callback){
    db.serialize(() => {
        var command = "DELETE FROM responses WHERE id = ?";
        db.run(command, [responseId], function(error) {
            if (error) {
                console.log(error);
                callback(false);
            } else {
                console.log('Removed response: ' + responseId);
                callback(true);
            }
        });
    });
}

/*
    Remove Responses By Question Id Method
    Description: Deletes specific responses based on questionId
    Parameters: Integer representing questionId
*/
exports.removeResponsesByQuestionId = function(questionId, callback){
    db.serialize(() => {
        var command = "DELETE FROM responses WHERE questionId = ?";
        db.run(command, [questionId], function(error) {
            if (error) {
                console.log(error);
                callback(false);
            } else {
                console.log('Removed responses corresponding to questionId: ' + questionId);
                callback(true);
            }
        });
    });

}












