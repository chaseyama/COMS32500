"use strict";
/********************************************************************
*********************************************************************
*********************************************************************
    QUESTIONS DATABASE FILE:
    CRUD Methods for Interacting with Questions Database
    Database Method SQLite
*********************************************************************
*********************************************************************
********************************************************************/

//Instantiate Database Connection Using SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("studyabroad.db");

/*****************************************
    Create Questions Table Method
*****************************************/
exports.createQuestionsTable = function() {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS questions (" +
          " id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          " title VARCHAR(255), " +
          " description VARCHAR(255), " +
          " category VARCHAR(255), " + 
          " author INTEGER, " +
          " FOREIGN KEY (author) REFERENCES users (id));");
    });  

}

/*****************************************
    Fetch All Questions Method
    Description: Fetch All Questions from Questions Database
*****************************************/
exports.fetchAllQuestions = function(callback){
    var command = "SELECT questions.id, questions.title, questions.description, " +
                " questions.category, questions.author, users.fname " +
                " FROM questions JOIN users ON questions.author=users.id;";
    db.serialize( () => {
        db.all(command, function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    callback(rows);
                }else{
                    console.log("No questions in database");
                    callback(null);
                }
            }
        });
    });
}

/*****************************************
    Get Questions by User Method
    Parameter: INT userId
    Description: Get Questions from Questions Database that correspond to the userId
*****************************************/
exports.fetchUsersQuestions = function(userId, callback){
    var command = "SELECT questions.id, questions.title, questions.description, " +
                " questions.category, questions.author, users.fname " +
                " FROM questions JOIN users ON questions.author=users.id " +
                " WHERE questions.author = ?;";
    db.serialize( () => {
        db.all(command, [userId], function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    callback(rows);
                }else{
                    console.log("No questions posted by this user");
                    callback(null);
                }
            }
        });
    });
}

/*****************************************
    Get Questions By Category Method
    Parameter: STRING questionCategory
    Description: Return Questions in a certain Category
*****************************************/
exports.fetchQuestionsByCategory = function(questionCategory, callback){
    var command = "SELECT questions.id, questions.title, questions.description, " +
                " questions.category, questions.author, users.fname " +
                " FROM questions JOIN users ON questions.author=users.id " +
                " WHERE questions.category = ?;";
    db.serialize( () => {
        db.all(command, [questionCategory], function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    callback(rows);
                }else{
                    console.log("No questions match this query");
                    callback(null);
                }
            }
        });
    });
}

/*****************************************
    Get Question By Id Method
    Parameter: INT questionId
    Description: Return specific Question based on Id
*****************************************/
exports.fetchQuestionById = function(questionId, callback){
    var command = "SELECT questions.id, questions.title, questions.description, " +
                " questions.category, questions.author, users.fname " +
                " FROM questions JOIN users ON questions.author=users.id " +
                " WHERE questions.id = ?;";
    db.serialize( () => {
        db.all(command, [questionId], function(error,rows){
            if(error){
                console.log(error);
            }else{
                if(rows.length != 0){
                    callback(rows);
                }else{
                    console.log("No questions match this id");
                    callback(null);
                }
            }
        });
    });
}

/*****************************************
    Insert Question Method
    Parameter: Question Object
    Description: Add New Question to the Questions table
*****************************************/
exports.insertQuestion = function(question){
	db.serialize(() => {
		var command = "INSERT INTO questions ('title', 'description', 'category', 'author') ";
        command += "VALUES (?, ?, ?, ?);";
        db.run(command, [question['title'], question['description'], question['category'], question['author']], function(error) {
            if (error) {
                console.log(error);
            } else {
                //Console check for add
                db.serialize(() => {
                    var command = "SELECT * FROM questions";
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
    Delete Question Method
    Parameter: INT questionId
    Description: Remove Question from the Questions table
*****************************************/
exports.removeQuestion = function(questionId, callback){
    db.serialize(() => {
        var command = "DELETE FROM questions WHERE id = ?";
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
