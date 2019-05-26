"use strict"

function delete_question(id)
{   
	document.getElementById("id").value = id;
	document.getElementById("delete_question_form").submit();
}

function delete_response(responseId, questionId)
{   
	document.getElementById("responseId").value = responseId;
	document.getElementById("questionId").value = questionId;
	document.getElementById("delete_response_form").submit();
}