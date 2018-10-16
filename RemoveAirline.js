var {ipcRenderer, remote} = require('electron');
var fs = require('fs');
var path = require('path');
const main = remote.require('./main.js');
const $ = require('jquery');
const constants = require('../constants');


 function handleResponse(val) {
     $("#Error").html("server responded with: " + val);
 }
 
 function displayError(val) {
 	$("#airlineList").hide();
 
 	$("#Error").html("server responded with: " + val);
 
 	$("#Error").show();

 	$('#RemoveAirline').prop('disabled', true);
 }

function displayOptions(val) {
	// hide the airline list prompt 
	$("#airlineList").hide();

	// check the passed-in parameter
	console.log(val);

	// select the "select" object in the page
	var x = document.getElementById("list");

	// add options into the "select" object
	for (var optionIndex in val) {
		console.log(optionIndex);
		temp = document.createElement("option");
		temp.text = val[optionIndex];
		x.add(temp);
	}
	
	// display the "select" object
	$("#list").show();
}


$( document ).ready(function() {
	$('#Error').hide();
	$('#list').hide();
	
	  document.getElementById("airlineList").innerHTML = "Loading Airline List ...";

	  // Get server list of airline 
	  // document.getElementById("airlineList").innerHTML = services.getAirlineList();
	  console.log("[+] : " + __dirname);

	  setTimeout(function(){
	  		var path = constants.API_CALLS.GET_AIRLINE_PATH;
	  		console.log(path);
	  
	  		var airlineList = ipcRenderer.sendSync(constants.API_CALLS.CURRENT_FOLDER_LIST, path);

	  		console.log(airlineList);

	  		if (!airlineList) {
	  			displayAirlinleList("Airline list is not available.");
	  		} else if (airlineList == constants.API_ERROR.PATH_NOT_VALID) {
	  			displayError("Path is not valid!");
	  		} else if (airlineList == constants.API_ERROR.EMPTY) {
	  			displayError("There's currently no files or folders under the current directory!")
	  		} else {
	  			displayOptions(airlineList);
	  		}
	  }, 1500);

	  	// functions to get the currently selected airline
		$('#list').change(function() {
			var selectedAirline = document.getElementById("list").value;
			console.log(selectedAirline);
		});

	  $('#RemoveAirline').click(()=>{
	  	console.log("Clicked remove Airline");
	  	// api called to see if the airline exists
	  	// api call to delete the airline if it does exist
		var airline = document.getElementById("list").value;
		var path = constants.API_CALLS.GET_AIRLINE_PATH;
		console.log("RA path: " + path);
		console.log("airline selected is: " + airline);
	  	// call the back end execution
      	// connect to server here
      	console.log(typeof airline);
      	console.log(typeof path);
      	//var selection = document.getElementById("list").value;
      	if(airline !== "-1"){
      		$('#NoSelection').hide();
    		let res = ipcRenderer.sendSync(constants.API_CALLS.REMOVE_AIRLINE, airline, path);
     		handleResponse(res);

     		if(res === "Remove Proceeded"){//"Remove Proceeded"
			//alert("Successfully deleted airline: " + txt_RemoveAirline.value );
			console.log("Removed airline: " + airline);
			document.getElementById("Successful").innerHTML = ("Successfully removed Airline: " + airline);
			$('#Successful').show();
        	$('#RA').hide();
        	setTimeout(RemoveSuccessful, 3000);
			}else{
				$('#Error').show();
			}
     	}
     	else{
     		console.log("Didn't select an airline");
     		$('#NoSelection').show();
     	}	
	  });

	  $('#CancelButton').click(()=>{
	  		console.log("Remove Airline cancel button clicked back to Index");
	  		location.href = "Index.html";
	  });
});

function RemoveSuccessful(){
  location.href = "Index.html";
}


/*$(function() {
  var bool = true, flag = false;
  $('#RemoveAirline').prop('disabled', bool); // use prop to disable the button

  $(document).keyup(function() { // listen the keyup on the document or you can change to form in case if you have or you can try the closest div which contains the text inputs
    $('input:text').each(function() { // loop through each text inputs
      bool = $.trim(this.value) === "" ?  true :  false; // update the var bool with boolean values
      if(bool)
      return flag;
    });
    $('#RemoveAirline').prop('disabled', bool); // and apply the boolean here to enable
  });
}); */

/*
function Cancel(){
	 location.href = "Welcomepg.html"
}

function RemoveAirline(txt_RemoveAirline){
	//API call to delete the airline
	//var worked = services.RemoveAirline(txt_RemoveAirline.value);
	var worked = true;
	if(worked ===true){
		alert("Successfully deleted airline: " + txt_RemoveAirline.value );
		location.href = "Welcomepg.html"
	}else{
		$('#Error').show();
	}

}*/

//add regex?