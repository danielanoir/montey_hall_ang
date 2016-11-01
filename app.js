var montyHall = angular.module('montyHall', []);
montyHall.controller('gameController', ['$scope', function(s) {

$(window).load(function(){
  function preload(arrayOfImages) {
      $(arrayOfImages).each(function(){
          $('<img/>')[0].src = this;
      });
  }

  preload([
      'door.png',
      'goat.jpg',
      'car.jpg'
  ]);
});


$(document).ready(function(){

var i = 0;
s["stickWins"] = 0;
s["switchWins"] = 0;

var stickPlus = function(scopeObject) {
  scopeObject["stickWins"] += 1;
};
var switchPlus = function(scopeObject) {
  scopeObject["switchWins"] += 1;
};

  var randBetween = function(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var Door = function(doorName, doorLabel, isOpen, isSelected, isPrize) {
    this.doorName = doorName;
    this.doorLabel = doorLabel;
    this.isOpen = isOpen;
    this.isSelected = isSelected;
    this.isPrize = isPrize;
  };

var doorCount = 3;
// var doorCount = prompt("number of doors:");
// console.log(doorCount);

startGame();

function startGame(){
  $("#gameStage").html("");

  var doorList = [];
  var prizeDoorNumber = randBetween(1,doorCount);

  for (i = 1; i <= doorCount; i++) {
    var isOpen = 0;
    var isSelected = 0;
    var isPrize = 0;
    if (i == prizeDoorNumber) {
        isPrize = 1;
    }
    var doorName = "door" + i.toString();
    var doorLabel = "Door " + i.toString();
    s[doorName] = new Door(doorName, doorLabel, isOpen,isSelected,isPrize);
    doorList.push(s[doorName]);
  }

  for (i = 0; i < doorCount; i++) {
    var element = $("<div id='" + doorList[i]["doorName"] + "'></div>");
    element.addClass("door");
    element.addClass("closed");
    $("#gameStage").append(element);
  }

  for (i = 0; i < doorCount; i++) {
    if (doorList[i]["isPrize"] == 1) {
      var prizeDoorId = doorList[i]["doorName"]
    }
  }

  var selectDoor = function(door) {
    for (var i = 0; i < doorCount; i++) {
      $('#' + doorList[i]["doorName"]).removeClass("selected")
      s[doorList[i]["doorName"]]["isSelected"] = 0;
    }
    door["isSelected"] = 1;
    $('#' + door["doorName"]).addClass("selected");
    var selectedDoor = door;
    revealGoat(selectedDoor);
  };

  var openDoor = function(door) {
    door["isOpen"] = 1;
    $("#" + door["doorName"]).removeClass("closed");
    if (door["isPrize"] == 1) {
      $("#" + door["doorName"]).addClass("prize");
    } else {
      $("#" + door["doorName"]).addClass("goat");
    }
  };

  $(".door").click(function(event) {
    var clickedDoor = s[event.target.id];
    selectDoor(clickedDoor);
  });

  var revealGoat = function(selectedDoor) {
  //if the door is not the prize door or selected, push it to revealCandidates array:
    var revealCandidates = [];
    for (var i = 0; i < doorCount; i++) {
      if (doorList[i]["isPrize"] == 0 &&
      s[doorList[i]["doorName"]]["isSelected"] == 0) {
        revealCandidates.push(doorList[i]["doorName"])
      }
    }
    //have potential doors now, so choose one at random to not reveal:
    var doNotRevealIndex = randBetween(0, revealCandidates.length-1);
    var doNotRevealDoorName = revealCandidates[doNotRevealIndex];
    //The prize door must not be revealed:
    if (selectedDoor["isPrize"] != 1 ) {
      doNotRevealDoorName = prizeDoorId
    }
    //loop through door objects in scope. If it's not selected, and not flagged to leave shut, open it:
    for (i = 0; i < doorCount; i++) {
      if (s[doorList[i]["doorName"]]["isSelected"] != 1 && doorList[i]["doorName"] != doNotRevealDoorName) {
        openDoor(s[doorList[i]["doorName"]]);
      }
    }

  var otherClosedDoor = s[doNotRevealDoorName];
  //calling function that offers the user to switch to the other closed door or stick with the selected door:
  switchOffer(selectedDoor, otherClosedDoor);
  };

  var switchOffer = function(selectedDoor, otherClosedDoor) {

    var userInput = prompt("I'm opening one of the doors with a goat behind it. Would you like to STICK with your current door or SWITCH to the other option?");
    if (userInput.toUpperCase() == "STICK") {
      openDoor(selectedDoor);
    }
    else if (userInput.toUpperCase() == "SWITCH") {
      openDoor(otherClosedDoor);
    }
    else {
     switchOffer(selectedDoor, otherClosedDoor);
    }

    tallyResults();
  };

  var tallyResults = function() {
    var gameWon = 0;
    for (var i = 0; i < doorCount; i++) {
      if (s[doorList[i]["doorName"]]["isOpen"] == 1 && s[doorList[i]["doorName"]]["isPrize"] == 1) {
        gameWon = 1;
        }
      }
      winOrLose(gameWon);
  };

  var winOrLose = function(gameWon) {
    for (var i = 0; i < doorCount; i++) {
      $('#' + doorList[i]["doorName"]).removeClass("selected")
      s[doorList[i]["doorName"]]["isSelected"] = 0;
    }
    var confirmMessage = "";
    if (gameWon == 1) {
      confirmMessage = "You won! ";
      // alert("You won! Play again?");
      // startGame();
    } else {
      confirmMessage = "You lost. ";
      // alert("You lost. Play again?");
      // startGame();
    }
    var r = confirm(confirmMessage + "Play again?");
    if (r) {
      startGame();
    }
    else {
      $("#gameStage").html("");
    }
  };
}
});
}]);
