var firebaseConfig = {
  apiKey: "AIzaSyALqLYw9MYNlSgrsrVfSopnDd7m0miz0zw",
  authDomain: "tian-1-11f6b.firebaseapp.com",
  databaseURL: "https://tian-1-11f6b.firebaseio.com",
  projectId: "tian-1-11f6b",
  storageBucket: "tian-1-11f6b.appspot.com",
  messagingSenderId: "206747680454",
  appId: "1:206747680454:web:8fb6ece8f4c9f42c0a21c7"
};

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

  database.ref().push(newTrain);

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

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var startTime = childSnapshot.val().startTime;
  var frequency = childSnapshot.val().frequency;

  console.log(name);
  console.log(destination);
  console.log(startTime);
  console.log(frequency);

  var trainStartUnix = moment.unix(startTime).format("HH:mm");

  var minDiff = moment().diff(moment(startTime, "X"), "minutes");
  console.log(minDiff);

  var empBilled = empMonths * empRate;
  console.log(empBilled);

  var newRow = $("<tr>").append(
    $("<td>").text(empName),
    $("<td>").text(empRole),
    $("<td>").text(empStartPretty),
    $("<td>").text(empMonths),
    $("<td>").text(empRate),
    $("<td>").text(empBilled)
  );

  $("#employee-table > tbody").append(newRow);
});
