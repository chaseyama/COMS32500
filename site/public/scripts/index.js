"use strict";

/**************************
	Instantiate Variables 
	Using QuerySelector
***************************/
var modal = document.querySelector("#myModal");
var span = document.querySelector(".close")[0];
var first_visit = document.getElementById("first_visit").innerHTML;

/***************************
	Add Event Listener to 
	Display Popup
***************************/
addEventListener('load', displayModal);


/***************************
	Popup Method
***************************/
function displayModal(){
	if(first_visit == 'true'){
		modal.style.display = "block";
	}
	window.addEventListener('click', close);
}

// When the user clicks on <span> (x), close the modal
function close(event) {
    modal.style.display = "none";
}
