var montyHall = angular.module('montyHall', []);
montyHall.controller('gameController', ['$scope', function(s) {

  var randBetween = function(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  var Door = function(doorName, doorLabel, isOpen, isSelected, isPrize) {
    this.doorName = doorName;
    this.doorLabel = doorLabel;
    this.isOpen = isOpen;
    this.isSelected = isSelected;
    this.isPrize = isPrize;
  };

var doorCount = 3;
var doorList = [];
var prizeDoorNumber = randBetween(1,doorCount);

for (var i = 1; i <= doorCount; i++) {
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

var selectDoor = function(door) {
  door["isSelected"] = 1;
  $('#' + door["doorName"]).addClass("selected");
}

for (var i = 0; i < doorList.length; i++) {
  var element = $("<div id='" + doorList[i]["doorName"] + "' class='door'></div>").text(doorList[i]["doorLabel"]);
  $("#gameStage").append(element);
}

for (var i = 0; i < doorList.length; i++) {
  if (doorList[i]["isPrize"] == 1) {
    var prizeDoorId = doorList[i]["doorName"]
  }
}

var openDoor = function(door) {
  door["isOpen"] = 1;
  if (door["isPrize"] == 1) {
    $('#' + door["doorName"]).append('<img src="http://www.usa.philips.com/c-dam/b2c/category-pages/lighting/car-lights/master/footer/nafta-car.png"></img>')
  } else {
    $('#' + door["doorName"]).append('<img src="http://animalia-life.com/data_images/goat/goat4.jpg"></img>')
  }
}

$(".door").click(function(event) {
  selectDoor(s[event.target.id]);

  var candidates = [];
  for (var i = 0; i < doorList.length; i++) {
    if (doorList[i]["isPrize"] == 0 && doorList[i]["isSelected"] == 0) {
      candidates.push(doorList[i]["doorName"])
    }
  }
  var doNotRevealIndex = randBetween(0, candidates.length-1);
  var doNotRevealDoorName = candidates[doNotRevealIndex];
  if (prizeDoorId != event.target.id) {
    doNotRevealDoorName = prizeDoorId
  }
  for (var i = 0; i < doorList.length; i++) {
    if (doorList[i]["isSelected"] != 1 && doorList[i]["doorName"] != doNotRevealDoorName) {
      openDoor(s[doorList[i]["doorName"]])
    }
  }
  var userInput = prompt("would you like to STICK with your current door or SWITCH to the other option?");
  if (userInput == "STICK") {
    openDoor(s[event.target.id]);
    if (event.target.id == prizeDoorId) {
      console.log("you won!");
      // $("#stuck").append(+1);
      s.score = (+1);
    } else {
      console.log("You lost.");
    }
  } else {
    openDoor(s[doNotRevealDoorName]);
    if (event.target.id != prizeDoorId) {
      console.log("you won!");
      // $("#switched").append(+1);
      s.score = (+1);

    } else {
      console.log("You lost.");
    }
  }

});

// console.log(s);
// s.doorLabel = s.door1["doorLabel"]

}]);
