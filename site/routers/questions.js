"use strict";

/********************************************************************
*********************************************************************
*********************************************************************
    QUESTIONS FILE:
    Route Handlers for Questions
*********************************************************************
*********************************************************************
********************************************************************/

const express = require("express");
const router = express.Router();
const questions = require('./questions_db.js');
const responses = require('./responses_db.js');
const notification = require('./notification_db.js');

/*****************************************
    Fetch Questions by Category Route Handler
    Description: Fetch Questions by Category
*****************************************/
router.post('/fetch_by_category', function (req,res){
    var user;
    if(req.user) user = req.user;
    else user = null;
    questions.fetchQuestionsByCategory(req.body.category, (rows) =>{
        if(rows){
            res.render('questions', {browse: true, browseResults: rows,
        user: user});
        }else{
            res.render('questions', {browse: true, browseResults: null,
        user: user});
        }
    });
})

/*****************************************
    Fetch Question by Id Route Handler
    Description: Fetch a Question and it's Responses by QuestionId
*****************************************/
router.get('/fetch_by_id', function (req,res){
    var user;
    if(req.user) user = req.user;
    else user = null;
    questions.fetchQuestionById(req.query.id, (rows) =>{
        var question = rows[0];
        responses.fetchResponsesByQuestionId(question.id, (rows) =>{
            if(rows){
                res.render('one_question', {
                    browse: true, 
                    question: question,
                    responses: rows,
                    user: user
                });
            }else{
                res.render('one_question', {
                    browse: true, 
                    browseResults: null,
                    question: question,
                    responses: null,
                    user: user
                });
            }
        });
    });
})

/*****************************************
    Post Question Route Handler
    Description: Post a New Question
*****************************************/
router.post('/post_question', function (req,res){
    //Insert into database
    var newQuestion = {
        'title': req.body.title,
        'description': req.body.description,
        'category': req.body.category,
        'author': req.body.author
    };
    questions.insertQuestion(newQuestion);
    //Redirect
    var user;
    if(req.user) user = req.user;
    else user = null;
    questions.fetchAllQuestions((rows) =>{
        if(rows){
            res.render('questions', {browse: true, browseResults: rows,
        user: user});
        }else{
            res.render('questions', {browse: true, browseResults: null,
        user: null});
        }
    });
    
})

/*****************************************
    Delete Question Route Handler
    Description: Delete a Question and its responses
*****************************************/
router.get('/delete_question', function (req,res){
    questions.fetchQuestionById(req.query.id, (rows) =>{
        var question = rows[0];
        responses.removeResponsesByQuestionId(req.query.id, (rows) =>{
            questions.removeQuestion(req.query.id, (rows) =>{
                //Redirect
                    var user = null;
                    if(req.user) user = req.user;
                
                    questions.fetchAllQuestions((rows) =>{
                        if(rows){
                            res.render('questions', {browse: true, browseResults: rows,
                        user: user});
                        }else{
                            res.render('questions', {browse: true, browseResults: null,
                        user: null});
                        }
                    });
            });
        });
    });
    
})

module.exports = router;