"use strict";

/********************************************************************
*********************************************************************
*********************************************************************
    RESPONSES FILE:
    Route Handlers for Responses
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
    Post Response Route Handler
    Description: Post a New Response
*****************************************/
router.post('/post_response', function (req,res){
    //Insert into database
    var newResponse = {
        'description': req.body.description,
        'author': req.body.author,
        'questionId': req.body.questionId
    };
    responses.insertResponse(newResponse);
    //Redirect
    var user;
    if(req.user) user = req.user;
    else user = null;
    questions.fetchQuestionById(req.body.questionId, (rows) =>{
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
    Delete Response Route Handler
    Description: Delete a Response by its Id
*****************************************/
router.get('/delete_response', function (req,res){
    responses.removeResponse(req.query.id, (rows) =>{ 
    //Redirect
        var user = null;
        if(req.user) user = req.user;
    
        questions.fetchQuestionById(req.query.questionId, (rows) =>{
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
    });
})

module.exports = router;