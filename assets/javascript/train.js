var currentTime = moment().format("HH:mm");

var trainName = "";
var dest = "";
var firstTime = "";
var frequency = 0;

var config = {
    apiKey: "AIzaSyD7FBdj4shImz19pCso4RlDRXZh198ABco",
    authDomain: "train-schedule-c7396.firebaseio.com/",
    databaseURL: "https://train-schedule-c7396.firebaseio.com/",
    projectId: "train-schedule-c7396",
    storageBucket: "train-schedule-c7396.appspot.com",
    messagingSenderId: "63047425965",
  };
firebase.initializeApp(config);


var database = firebase.database();

function submitForm() {
	$("#add-train-btn").on("click", function(event) {
		event.preventDefault();

		trainName = $("#train-name-input").val().trim();
		dest = $("#destination-input").val().trim();
		firstTime = $("#first-time-input").val().trim();
		frequency = $("#frequency-input").val().trim();

		var newTrain = {
			name: trainName,
			dest: dest,
			time: firstTime,
			freq: frequency
		};

		database.ref().push(newTrain);

		console.log(newTrain.name);
		console.log(newTrain.dest);
		console.log(newTrain.time);
		console.log(newTrain.freq);

		$("#train-name-input").val("");
		$("#destination-input").val("");
		$("#first-time-input").val("");
		$("#frequency-input").val("");
	});
};

function trainTable() {
	database.ref().on("child_added", function(childSnapshot) {
		console.log(childSnapshot.val());

		trainName = childSnapshot.val().name;
		dest = childSnapshot.val().dest;
		firstTime = childSnapshot.val().time;
		frequency = childSnapshot.val().freq;

  	var convertedFirstTime = moment(firstTime, 'HH:mm').subtract(1, 'years');
  	console.log("First: " + firstTime);
  	console.log(convertedFirstTime);

  	var diffTime = moment().diff(moment(convertedFirstTime), "minutes");
      console.log("Difference in Time: " + diffTime);
      
  	var tRemainder = diffTime % frequency;
  	console.log(tRemainder);

  	var minAway = frequency - tRemainder;
  	console.log("Minutes to train: " + minAway);

  	var nextTrain = moment().add(minAway, "minutes");
  	console.log("Arrival time: " + moment(nextTrain).format("HH:mm"));

		$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + minAway + "</td></tr>")
	});
};

$(document).ready(function() {
 	submitForm();
 	trainTable();
 	console.log("Time: " + currentTime);
 	$on("loaded").$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + minAway + "</td></tr>");
 });