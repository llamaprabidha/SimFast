const timer = document.getElementById('stopwatch');


var hr = 0;
var min = 0;
var sec = -1;

var stoptime = true;
var playSpeed = 1000;
var selectedSpeed = 1;


function startTimer() {
  
  if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
  }
}

function timerSpeed(){
  let selectedSpeed = document.getElementById("selectedSpeed").value;
  playSpeed = 1000;

  switch (selectedSpeed) {
    case '0.25':
      playSpeed /= 0.25;
      break;
    case '0.5':
      playSpeed /= 0.5;
      break;
    case '2':
      playSpeed /= 2;
      break;
    case '4':
      playSpeed /= 4;
      break;
    case '8':
      playSpeed /= 8;
      break;
    case '16':
      playSpeed /= 16;
      break;
    case '32':
      playSpeed /= 32;
      break;
    case '64':
      playSpeed /= 64;
      break;
  }
}

function timerCycle() {
  if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    if (sec < 10 || sec == 0) {
      sec = '0' + sec;
    }
    if (min < 10 || min == 0) {
      min = '0' + min;
    }
    if (hr < 10 || hr == 0) {
      hr = '0' + hr;
    }

    let timeString = hr + ':' + min + ':' + sec;
    timer.innerHTML = timeString;
    
    // Start flights that are scheduled to start at the current time
    startTimes?.[timeString]?.forEach(index => setTimeout(() => animate(flights[index]), 0));

    setTimeout("timerCycle()", playSpeed);
  }
}

function resetTimer() {
    stoptime = true;
    if (hr > 0 || min > 0 || sec > 0) {
      hr = 0;
      min = 0;
      sec = -1;
      timer.innerHTML = '00:00:00';
    } 
}

//progress bar test

var i = 0;

function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("Bar");
    var width = 1;
    var id = setInterval(frame, 1);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}
