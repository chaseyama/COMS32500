"use strict"
/************************************
    Question Javascript File:
    Route Handlers for Questions
*************************************/

//Get Question By Id
function fetch_by_id(id)
{   
	document.getElementById("id").value = id;
	document.getElementById("fetch_by_id_form").submit();
}