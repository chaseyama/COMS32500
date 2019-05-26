"use strict"

var d_question = document.querySelector("#delete_question");
d_question.addEventListener('click', delete_question);

function delete_question(id)
{   
	var id = document.querySelector("#question_id").innerHTML;
	document.querySelector("#id").value = id;
	document.querySelector("#delete_question_form").submit();
}

function delete_response(responseId, questionId)
{   
	document.getElementById("responseId").value = responseId;
	document.getElementById("questionId").value = questionId;
	document.getElementById("delete_response_form").submit();
}