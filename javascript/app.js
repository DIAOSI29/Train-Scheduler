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

var textEmail = $("#emailInput");
var textPassword = $("#passwordInput");
var loginBtn = $("#loginBtn");
var registerBtn = $("#registerBtn");
var signoutBtn = $("#signoutBtn");

//function for display userinterface depend on login status
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;
  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});

//login button clicked and firebase will perform authorisation check
$("#loginBtn").click(e => {
  e.preventDefault;

  const email = textEmail.val();
  console.log(email);
  const password = textPassword.val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(e => {
      console.log(e.message);
      $("#failed-login").html("Login Failed ... Please try again :(");
    });

  textEmail.val("");
  textPassword.val("");
});

//function for register new account and save it on firebase database
$("#registerBtn").click(e => {
  e.preventDefault();
  const email = textEmail.val();
  console.log(email);
  const password = textPassword.val();
  if (email.length < 4) {
    alert("Please enter a valid email address.");
    return;
  }
  if (password.length < 4) {
    alert("Please set a stronger password.");
    return;
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(e => console.log(e.message));
  textEmail.val("");
  textPassword.val("");
});

//to signout and clear input area
$("#signoutBtn").click(() => {
  firebase.auth().signOut();
  $("#failed-login").html("");
});

//database section//

var database = firebase.database();

//show train data in required format upon button click
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

  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#startTimeInput").val("");
  $("#frequencyInput").val("");
});

//add event listener to keep adding new train data to the table with edit and delete button generated dynamically
database.ref("Trains").on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());
  console.log(childSnapshot.key);

  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var startTime = childSnapshot.val().startTime;
  var frequency = childSnapshot.val().frequency;
  var childKey = childSnapshot.key;

  console.log(name);
  console.log(destination);
  console.log(startTime);
  console.log(frequency);

  var firstTimeConverted = moment(startTime, "HH:mm").subtract(1, "days");
  var minDiff = moment().diff(moment(firstTimeConverted), "minutes");
  var minAway = frequency - (minDiff % frequency);
  var nextArrival = moment()
    .add(minAway, "minutes")
    .format("hh:mm a");

  console.log(firstTimeConverted);
  console.log(minDiff);
  console.log(nextArrival);

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
        .text(minAway),
      $("<button>")
        .addClass("trainDetailDisplay")
        .text("Edit")
        .click(function() {
          generateForm(childKey);
        }),
      $("<button>")
        .addClass("trainDetailDisplay")
        .text("Delete")
        .click(function() {
          deleteRow(childKey);
        })
    );

  $("#newTrains").append(newRow);
});

//display train table change form where user can modify targeted train detail by filling out an update data form
function generateForm(key) {
  var formForEdit = $("<form>");
  formForEdit.addClass("editForm").append(
    $("<label>")
      .text("Change Name")
      .addClass("bgForm"),
    $("<input>").attr({ type: "text", class: "nameChange" }),
    $("<label>")
      .text("Change Destination")
      .addClass("bgForm"),
    $("<input>").attr({ type: "text", class: "destinationChange" }),
    $("<label>")
      .text("Change Start Time")
      .addClass("bgForm"),
    $("<input>").attr({ type: "number", class: "startTimeChange" }),
    $("<label>")
      .text("Change Frequency")
      .addClass("bgForm"),
    $("<input>").attr({ type: "number", class: "frequencyChange" }),
    $("<button>")
      .text("Confirm Change")
      .attr({ type: "submit", class: "submitChange" })
      .click(function() {
        changeThisTrain(key);
      })
  );
  $("#changeFormSection").html(formForEdit);
}

//function for editting train detail and update next arrival time as well as minutes away accordingly
function changeThisTrain(trainID) {
  var nameChange = $(".nameChange").val();
  var destinationChange = $(".destinationChange").val();
  var startTimeChange = $(".startTimeChange").val();
  var frequencyChange = $(".frequencyChange").val();

  database
    .ref("Trains")
    .child(trainID)
    .update({
      name: nameChange,
      destination: destinationChange,
      startTime: startTimeChange,
      frequency: frequencyChange
    });
}

//delete specific train
function deleteRow(trainID) {
  database
    .ref("Trains")
    .child(trainID)
    .remove();
}

//once a train table is deleted, refresh the UI with corresponding data deleted)
database.ref("Trains").on("child_removed", function(snapshot) {
  console.log(snapshot);
  location.reload();
});
