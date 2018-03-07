
var url = "https://rawgit.com/DJ2Play/Practica-jsxml/master/xml/XML.xml"; //direccion github de XML pasado a rawgit
var url2 = "otrarawgit";

var xmlDoc = null;
var questionXML;
var questionHTML;


var answers0 = [];
var answers1 = [];
var answers2 = [];
var answers3 = [];
var answers4 = [];
var answers5 = [];
var answers6 = [];
var answers7 = [];
var answers8 = [];
var answers9 = [];

var mark = 0.0;
var correct = false;

window.onload = function(){
 //LEER XML de xml/preguntas.xml
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			gestionarXml(this);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();

	document.getElementById("submitButton").onclick = function(){ //clicking on Submit button will revise & correct the exam
		if (correct == false && revise()){
			correctFunction();
		}
	}
}
//****************************************************************************************************
// Recuperamos los datos del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml){
 var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc

//*****************************************************************

	questionXML = xmlDoc.getElementsByTagName("question");
	questionHTML = document.getElementsByClassName("question");
	
	var questionType = xmlDoc.getElementsByTagName("type");
	var titleHTML = document.getElementsByClassName("title");
	var titleXML = xmlDoc.getElementsByTagName("title");
	var i;
	var j;
	var numOptions;
	var numAnswers;
	
	for (i = 0; i < questionXML.length; i++){
		titleHTML[i].innerHTML = titleXML[i].innerHTML;
		numOptions = questionXML[i].getElementsByTagName("option").length;
		numAnswers = questionXML[i].getElementsByTagName("answer").length;
		var tipo = questionType[i].innerHTML;
			
				if (questionType[i].innerHTML == "select" || questionType[i].innerHTML == "multiple"){
					var optionXML = [];
					
					optionXML = readOptions (numOptions, i);
					fillSelect (optionXML, i);
				}
				
				if (xmlDoc.getElementsByTagName("type")[i].innerHTML == "checkbox"){
					var optionXML = [];
					
					optionXML = readOptions (numOptions, i);
					fillCheckbox (optionXML, i);
				}
				if (xmlDoc.getElementsByTagName("type")[i].innerHTML == "radio"){
					var optionXML = [];
					
					optionXML = readOptions (numOptions, i);
					fillRadio (optionXML, i);
				}
			for (j = 0; j < numAnswers; j++){
				//eval("answers" + i + "[" + j + "]" = questionXML[i].getElementsByTagName("answer"[j].innerHTML");
				window["answers" + i][j] = questionXML[i].getElementsByTagName("answer")[j].innerHTML;
			}
	}
}


function readOptions (numOptions, i){
	var optionXML = [];
	
	for (j = 0; j < numOptions; j++){
		optionXML[j] = questionXML[i].getElementsByTagName("option")[j].innerHTML;
	}
	
	return optionXML;
}

function fillCheckbox (optionXML, pos){
	for (i = 0; i < optionXML.length; i++){
		var input = document.createElement("input");
		var label = document.createElement("label");
		
		label.innerHTML = optionXML[i];
		label.setAttribute ("for","p" + pos + "_" + i);
		input.type = "checkbox";
		input.value= i + 1;
		input.name = "p" + pos + "_" + i;
		input.id = "p" + pos + "_" + i;
		
		questionHTML[pos].appendChild(input);
		questionHTML[pos].appendChild(label);
		questionHTML[pos].appendChild(document.createElement("br"));
	}
}

function fillRadio (optionXML, pos){
	for (i = 0; i < optionXML.length; i++){
		var input = document.createElement("input");
		var label = document.createElement("label");
		
		label.innerHTML = optionXML[i];
		label.setAttribute ("for","p" + pos + "_" + i);
		input.type = "radio";
		input.value= i + 1;
		input.name = "p" + pos;
		input.id = "p" + pos + "_" + i;
		
		questionHTML[pos].appendChild(input);
		questionHTML[pos].appendChild(label);
		questionHTML[pos].appendChild(document.createElement("br"));
	}
}
	
function fillSelect (optionXML, pos){
	var select = questionHTML[pos].getElementsByTagName("select")[0];
	for (i = 0; i < optionXML.length; i++){
		var option = document.createElement("option");
		option.innerHTML = optionXML[i];
		
		option.value = i + 1;
		select.options.add(option);
	}
}
function revise(){ //revise if the questioni are correctly answered
	var answered;
	
	for (i = 0; i < questionHTML.length; i++){
		if (i == 0 || i == 1) { //revise the "text" questions
			if (questionHTML[i].getElementsByTagName("text").value == "") { //questions without being answered
				alert("You didn't answer all questions. Please revise the questions");
				questionHTML[i].getElementsByTagName("text")[0].focus(); //focus the screen on the not-answered question
			
				return false;
			}
		} else if (i == 2 || i == 3){ //revise the "select" questions
			if (questionHTML[i].getElementsByTagName("select")[0].selectedIndex == 0){ //questions without being answered
				alert("You didn't answer all questions. Please revise the questions");
				questionHTML[i].getElementsByTagName("select")[0].focus(); //focus the screen on the not-answered question
			
				return false;
			}
		} else if (i == 4 || i == 5) { //revise the "multiple select" questions
			answered = false;
			var mul = questionHTML[i].getElementsByTagName("select")[0];
			for (j = 0; j < mul.length; j++) { //revise if more than one are selected
				if (mul.options[j].selected) {
					answered = true; 
				}
			}
			if (!answered) { //if more than one not selected
				alert("You didn't answer all questions. Please revise the questions");
				sel.focus(); //focus on the not-answered question
				
				return false;
			}
		} else if (i == 6 || i == 7) { //revise the "checkbox" questions
			answered = false;
			var chk = questionHTML[i].getElementsByTagName("input");
			for (j = 0; j < chk.length; j++) { //revise all answers
				if (chk[j].checked) { //if checked
					answered = true;
				}
			}
			if (!answered) { //if it's not answered
				alert("You didn't answer all questions. Please revise the questions");
				chk[0].focus();
				
				return false;
			}
		}
	}
	return true;	
}

function correctFunction(){ //correct given answers
	for (i = 0; i < questionHTML.length; i++) {
		if (i == 0 || i == 1) {
			correctText(i);
		} else if (i == 2 || i == 3) {
			correctSelect(i);
		/* } else if (i == 4 || i == 5) {
			correctMultiple(i);
		} else if (i == 6 || i == 7) {
			correctCheckbox(i); */
		} else if (i == 8 || i == 9) {
			correctRadio(i);
		}
	}
}
function correctText(i){
	var answer = document.getElementById("q" + i).value;
	if (answer.toUpperCase() == window["answers" + i][0].toUpperCase()){
		mark += 1;
	} else {
		var correctAnswer = document.createElement("h2");
		correctAnswer.innerHTML = "The correct answer is: " + xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML(i , 0);
		document.getElementById(i).appendChild(correctAnswer);
	}
}

function correctSelect(i){
	var answer = document.getElementById("select" + i);
	if (answer.selectedIndex == window["answers" + i][0]){
		mark += 1;
	} else {
		var correctAnswer = document.createElement("h2");
		correctAnswer.innerHTML = "The correct answer is: " + xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[j].innerHTML(i,(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML(i,0) - 1));
		document.getElementById(i).appendChild(correctAnswer);
	}
}

function correctMultiple(i){
	var answer = document.getElementById("select" + i).getElementsByTagName("option");
	var increase = 0;
	for (j = 0; j < answer.length; j++) {
		if (answer[j].selected){
			var correct = false;
			for (k = 0; k < window["answers" + i].length; k++) {
				if (j == window["answers" + i][k]){
					correct = true;
				}
			}
			if (correct){
				increase += (1.00 / window["answers" + i].length);
			} else {
				increase -= (1.00 / window["answers" + i].length);
			}
		} 
	}
	mark += increase;
	if (increase < 0.95){
		correctAnswers(i);
	}
}

function correctCheckbox(i){
	var answer = document.getElementById(i).getElementsByTagName("input");
	var increase = 0;
	for (j = 0; j < answer.length; j++) {
		if (answer[j].checked){
			var correct = false;
			for (k = 0; k < window["answers" + i].length; k++) {
				if (j == window["answers" + i][k]){
					correct = true;
				}
			}
			if (correct){
				increase += (1.00 / window["answers" + i].length);
			} else {
				increase -= (1.00 / window["answers" + i].length);
			}
		}
	}
	mark += increase;
	if (increase < 0.95){
		correctAnswers(i);
	}
}

function correctRadio(i){
	var answer = document.getElementById(i).getElementsByTagName("input");
	var answer = 0;
	for (j = 0; j < answer.length; j++) {
		if (answer[j].checked){
			if (j == window["answers" + i][0]){
				increase = 1;
			}
		}
	}
	if (increase == 1){
		mark += increase;
	} else {
		var correctAnswer = document.createElement("h2");
		correctAnswer.innerHTML = "The correct answer is: " + xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[j].innerHTML(i,xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML(i,0));
		document.getElementById(i).appendChild(correctAnswer);
	}
	
}
function correctAnswers(i){
	var newText = document.createElement("h2");
	newText.innerHTML = "The correct answers are: ";
	document.getElementById(i).appendChild(newText);
	var numAnswers = questionXML[i].getElementsByTagName("answer").length;
	for (j = 0; j < numAnswers; j++) {
		var newText = document.createElement("h2");
		newText.innerHTML = xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[j].innerHTML(i,xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML(i,j));
		document.getElementById(i).appendChild(newText);
	}
}
function showMark(){ //show the mark when submitted
	document.getElementById("").style.display = "none";
	document.getElementById("").style.display = "block";
	document.getElementById("mark").innerHTML = notDecimal();
	if (notDecimal() >= 5) {
		document.getElementById("message").innerHTML = "Good job, you passed the exam!"
	} else {
		document.getElementById("message").innerHTML = "Sorry, you didn't pass the exam. Try again!"
	}
}
function notDecimal() { //convert the mark to a non-decimal number
	var notDec;
	if (mark < 0) {
		notDec = 0;
	} else {
		notDec = parseFloat(mark.toFixed(2));
	}
	return notDec;
}