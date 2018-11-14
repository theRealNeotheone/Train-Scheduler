var currentTime = moment().format("HH:mm");

/**Defining variables that will be used later**/
var trainName = "";
var dest = "";
var firstTime = "";
var frequency = 0;

var config = {
	apiKey: "AIzaSyAou5MUDs_RCrS5BVaIz9ffnpz3XwjvO6M",
	authDomain: "train-scheduler-abea2.firebaseapp.com",
	databaseURL: "https://train-scheduler-abea2.firebaseio.com",
	projectId: "train-scheduler-abea2",
	storageBucket: "",
	messagingSenderId: "817438387094"
  };
  
firebase.initializeApp(config);

/**Creating a variable to reference the database**/
var database = firebase.database();


function submitForm() {
	$("#add-train-btn").on("click", function(event) {
		event.preventDefault();

		// Grabbing user input
		trainName = $("#train-name-input").val().trim();
		dest = $("#destination-input").val().trim();
		firstTime = $("#first-time-input").val().trim();
		frequency = $("#frequency-input").val().trim();

		// Creating local "temporary" objects for holding train data
		var newTrain = {
			name: trainName,
			dest: dest,
			time: firstTime,
			freq: frequency
		};

		// Uploading train data to the database
		database.ref().push(newTrain);

		// Console logging everything
		console.log(newTrain.name);
		console.log(newTrain.dest);
		console.log(newTrain.time);
		console.log(newTrain.freq);

		// Clearing the form
		$("#train-name-input").val("");
		$("#destination-input").val("");
		$("#first-time-input").val("");
		$("#frequency-input").val("");
	});
};

/**Function for adding data in Firebase to the webpage**/
function trainTable() {
	database.ref().on("child_added", function(childSnapshot) {
		console.log(childSnapshot.val());

		// Storing everything into a variable
		trainName = childSnapshot.val().name;
		dest = childSnapshot.val().dest;
		firstTime = childSnapshot.val().time;
		frequency = childSnapshot.val().freq;

		// Calculating next train (pushing the first train back one year to ensure it comes before the current time)
  	var convertedFirstTime = moment(firstTime, 'HH:mm').subtract(1, 'years');
  	console.log("First: " + firstTime);
  	console.log(convertedFirstTime);

  	// Calculating the difference between current time & first train
  	var diffTime = moment().diff(moment(convertedFirstTime), "minutes");
  	console.log("Difference in Time: " + diffTime);

  	///// Calculating time apart (remainder)
  	var tRemainder = diffTime % frequency;
  	console.log(tRemainder);

  	///// Calculating minutes until the train
  	var minAway = frequency - tRemainder;
  	console.log("Minutes to train: " + minAway);

  	///// Calculating the next train time
  	var nextTrain = moment().add(minAway, "minutes");
  	console.log("Arrival time: " + moment(nextTrain).format("HH:mm"));

		// Adding each train's data into the table
		$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + minAway + "</td></tr>")
	});
};

$(document).ready(function() {
 	submitForm();
 	trainTable();
 	console.log("Time: " + currentTime);
 	$on("loaded").$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + minAway + "</td></tr>");
 });
