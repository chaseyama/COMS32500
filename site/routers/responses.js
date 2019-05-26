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
                    success_message: null,
                    browse: true,
                    question: question,
                    responses: rows,
                    user: user
                });
            }else{
                res.render('one_question', {
                    success_message: null,
                    browse: true, 
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
router.post('/delete_response', function (req,res){
    responses.removeResponse(req.body.responseId, (rows) =>{ 
    //Redirect
        var user = null;
        if(req.user) user = req.user;
        req.flash('success_message', 'Your response has been successfully deleted');
    
        questions.fetchQuestionById(req.body.questionId, (rows) =>{
            var question = rows[0];
            responses.fetchResponsesByQuestionId(question.id, (rows) =>{
                if(rows){
                    res.render('one_question', {
                        success_message: req.flash('success_message'),
                        browse: true, 
                        question: question,
                        responses: rows,
                        user: user
                    });
                }else{
                    res.render('one_question', {
                        success_message: req.flash('success_message'),
                        browse: true, 
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