"use strict";
/*
	This file contains the methods needed for the Q&A aspect of the website.
*/

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

/*
	Create Questions Database Table
*/
exports.createQuestionsTable = function() {
    db.serialize(() => {
        // create a new database table:
        db.run("CREATE TABLE IF NOT EXISTS questions (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " title VARCHAR(255), " +
          " description VARCHAR(255), " +
          " category VARCHAR(255), " + 
          " author INTEGER, " +
          " FOREIGN KEY (author) REFERENCES users (id));");

        console.log('successfully created the questions table in studyabroad.db');
    });  

}

/*
	Fetch All Questions Method
	Description: Query all questions from questions database
*/
exports.fetchAllQuestions = function(){

}

/*
	Query User's Questions Method
	Description: Query  questions from questions database that correspond to the userID
	Parameters: Object containing category
*/
exports.fetchUsersQuestions = function(userId, callback){
    console.log('Searching for all questions posted by: ' + userId);
    var command = "SELECT * FROM questions WHERE author = ?;";
    db.serialize( () => {
        db.all(command, [userId], function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    console.log(rows);
                    callback(rows);
                }else{
                    console.log("No questions posted by this user");
                    callback(null);
                }
            }
        });
    });
}
/*
	Query Question Method
	Description: Return specific question based on id
	Parameters: Integer representing question id
*/
exports.fetchQuestions = function(questionCategory, callback){
    console.log('Searching for all questions');
    var command = "SELECT * FROM questions WHERE category = ?;";
    db.serialize( () => {
        db.all(command, [questionCategory], function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    console.log(rows);
                    callback(rows);
                }else{
                    console.log("No questions match this query");
                    callback(null);
                }
            }
        });
    });
}

/*
	Insert New Question Method
	Description: Add new question to the question table
	Parameters: Dictionary object containing question information
*/
exports.insertQuestion = function(question){
	db.serialize(() => {
		var command = "INSERT INTO questions ('title', 'description', 'category', 'author') ";
        command += "VALUES (?, ?, ?, ?);";
        db.run(command, [question['title'], question['description'], question['category'], question['author']], function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Added new question' + question['title']);

                //Console check for add
                console.log('Checking added question')
                db.serialize(() => {
                    var command = "SELECT * FROM questions";
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
	Update Question Method
*/
exports.updateQuestion = function(item){

}

/*
	Remove Question Method
*/
exports.removeQuestion = function(questionId, callback){
    db.serialize(() => {
        var command = "DELETE FROM questions WHERE id = ?";
        db.run(command, [questionId], function(error) {
            if (error) {
                console.log(error);
                callback(false);
            } else {
                console.log('Removed question: ' + questionId);
                callback(true);
            }
        });
    });
}












