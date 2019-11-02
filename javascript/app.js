var firebaseConfig = {
  apiKey: "AIzaSyALqLYw9MYNlSgrsrVfSopnDd7m0miz0zw",
  authDomain: "tian-1-11f6b.firebaseapp.com",
  databaseURL: "https://tian-1-11f6b.firebaseio.com",
  projectId: "tian-1-11f6b",
  storageBucket: "tian-1-11f6b.appspot.com",
  messagingSenderId: "206747680454",
  appId: "1:206747680454:web:8fb6ece8f4c9f42c0a21c7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#trainNameInput")
    .val()
    .trim();
  var destination = $("#destinationInput")
    .val()
    .trim();

  var startTime = moment(
    $("#startTimeInput")
      .val()
      .trim(),
    "hmm"
  ).format("HH:mm");

  var frequency = $("#frequencyInput")
    .val()
    .trim();

  var newTrain = {
    name: trainName,
    destination: destination,
    startTime: startTime,
    frequency: frequency
  };

  database.ref("Trains").push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.startTime);
  console.log(newTrain.frequency);

  alert("New Train successfully added");

  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#startTimeInput").val("");
  $("#frequencyInput").val("");
});

database.ref("Trains").on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var startTime = childSnapshot.val().startTime;
  var frequency = childSnapshot.val().frequency;

  console.log(name);
  console.log(destination);
  console.log(startTime);
  console.log(frequency);
  console.log(firstTimeConverted);
  console.log(minDiff);
  console.log(nextArrival);

  var firstTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
  var minDiff = moment().diff(moment(firstTimeConverted), "minutes");
  var minAway = minDiff % frequency;
  var nextArrival = moment()
    .add(minAway, "minutes")
    .format("hh:mm a");

  var newRow = $("<tr>")
    .addClass("rowDisplay")
    .append(
      $("<td>")
        .addClass("trainDetailDisplay")
        .text(name),
      $("<td>")
        .addClass("trainDetailDisplay")
        .text(destination),
      $("<td>")
        .addClass("trainDetailDisplay")
        .text(frequency),
      $("<td>")
        .addClass("trainDetailDisplay")
        .text(nextArrival),
      $("<td>")
        .addClass("trainDetailDisplay")
        .text(minAway)
    );

  $("#newTrains").append(newRow);
});
