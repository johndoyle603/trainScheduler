
    let config = {
        apiKey: "AIzaSyAbrLagLUO1QtFbGd7R9O8aOk2-MkPZFfo",
        authDomain: "trainytrains.firebaseapp.com",
        databaseURL: "https://trainytrains.firebaseio.com",
        storageBucket: "trainytrains.appspot.com",
    };
    
        firebase.initializeApp(config);

        let database = firebase.database();

// Fill Firebase with initial data when button is clicked

$("#addTrain").on("click", function (event) {
    event.preventDefault();
    // Get user input from fields and assign to variables -- once the button's pressed, of course
    let trainName = $("#name")
        .val().trim();
    let destination = $("#destination")
        .val().trim();
    let firstTrain = $("#firstTrain")
        .val().trim();
    let frequency = $("#frequency")
        .val().trim();

    // Make local temporary storage to operate on train data

    let tempTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    // Upload train data to database
    database.ref().push(tempTrain);

    // Test in console

    console.log("Following values pushed to Firebase");
    console.log(tempTrain.name);
    console.log(tempTrain.destination);
    console.log(tempTrain.firstTrain);
    console.log(tempTrain.frequency);

    alert("Train added");

    // Rest of the input boxes

    $("#name").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

});

// Make firebase event that pulls data back from HTML and formats it correctly

database.ref().on("child_added", function(snapshot, prevChildkey){
console.log(snapshot.val());

// Store everything into a variable 

let snapName = snapshot.val().name;
let snapDestination = snapshot.val().destination;
let snapFirstTrain = snapshot.val().firstTrain;
let snapFrequency = snapshot.val().frequency;
let timeArr= snapFirstTrain.split(":")
let trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
let maxMoment = moment.max(moment(), trainTime);
let tMinutes;
let tArrival;

// If first train is later than current time, set arrival to first train time

if (maxMoment === trainTime){
    tArrival = trainTime.format("hh:mm");
    tMinutes = trainTime.diff(moment(),"minutes");
} else {
    
    // Calculate minutes until arrival
    
    let differenceTimes = moment().diff(trainTime, "minutes");
    let tRemainder = differenceTimes % snapFrequency;
    tMinutes = snapFrequency - tRemainder;

// Calculate arrival time of train, add tMinutes to the current time

tArrival = moment().add(tMinutes, "m").format("hh:mm");

}

console.log("tMinutes: ", tMinutes);
console.log("tArrival: " + tArrival);

// Add each peice of data to appropriate column on table

$('#train-list').append(`
<tr>
<th scope="row"> ${snapName}</th>
<td>${snapDestination}</td>
<td>${snapFrequency}</td>
<td>${tArrival}</td>
<td>${tMinutes}</td>
</tr>

`)

});