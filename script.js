window.onload = function () {

  var workSeconds = 0; //ONLY GLOBAL VARIABLE, USED TO STORE TOTAL TIME WORKED BETWEEN SESSIONS 

  //START BUTTON CLICK / TOUCH HANDLER
  var startButton = document.getElementById('start-button');
  var startTimer = function () {
    timer(userDuration());
  }
  startButton.addEventListener('click', startTimer);
  startButton.addEventListener('touchstart', startTimer);


  //RADIO TIME SELECTION HANDLER
  var displayText = function (string) {
    var displayBlock = document.getElementById('display-area');
    displayBlock.innerHTML = string;
  }

  var rads = document.getElementById("rad-buttons");
  var userDuration = function () {
    for (var elem of rads) {
      if (elem.checked) {
        displayText(elem.value + ' mins');
        return elem.value * 60000;
      }
    }
  }
  rads.addEventListener('change', userDuration);


  //RAD BREAK SELECTION HANDLER
  var breakRads = document.getElementById("break-rads");
  var workOrBreak = function () {
    for (var elem of breakRads) {
      if (elem.checked) {
        return elem.value;
      }
    }
  }
  breakRads.addEventListener('change', workOrBreak);

  // FUNCTION TO GET CURRENT TIME
  var getTimeInSeconds = function () {
    var currentTime = new Date();
    currentTime = currentTime.getTime();
    return Math.floor(currentTime / 1000);
  }

  //MAIN TIMER FUNCTION
  var timer = function (duration) {
    
    var running = true;
    var startTime = getTimeInSeconds();
    var endTime = startTime + (duration / 1000);


    //RECONFIGURE START BUTTON TO BE A PAUSE BUTTON
    startButton.innerHTML = 'pause';
    var toggleRunning = function () {
      running = !running;
    }
    startButton.removeEventListener('click', startTimer);
    startButton.removeEventListener('touchstart', startTimer);
    // NEED TO REMOVE THE PAUSE EVENT LISTENER HERE (timerRemainingTime) SINCE THERE IS NO WAY TO SEE IF THE EVENT LISTENER IS ATTACHED
    //AKA IF IT IS THE FIRST TIME THE PAUSE BUTTON HAS BEEN PRESSED, ALL EVENT LISTENERS MUST BE REMOVED
    //THUS THE NODE IS CLONED AND REPLACED WITH ITS CLONE AND THE CLONE IS RENAMED AS THE ORIGINAL TO PRESERVE THE FUNCTIONALITY
    startButtonClone = startButton.cloneNode(true);
    startButton.parentNode.replaceChild(startButtonClone, startButton);
    startButton = document.getElementById('start-button');
    startButton.addEventListener('click', toggleRunning);
    startButton.addEventListener('touchstart', toggleRunning);
    

    //ADD RESET BUTTON FUNCTIONALITY
    var resetButton = document.getElementById("reset");
    var resetSession = function () {
      window.clearInterval(timerInterval)
      startButton.innerHTML = 'start';
      displayText('restart');
      startButton.onclick = () => timer(userDuration());
      startButton.addEventListener('touchstart', startTimer, false);
    }
    resetButton.addEventListener('click', resetSession);
    resetButton.addEventListener('touchstart', resetSession);

    //UPDATE DISPLAY AND CHECK TIME WHILE TIMER IS RUNNING 
    var timerInterval = window.setInterval(function () {

      var currentTime = getTimeInSeconds();

      //CHECK FOR PAUSE
      //new timer will be prepared with remaining time on pause
      var timerRemainingTime = function () {
        timer(remainingTime);
      }
      //pause button will return to start button functionality
      if (!running) {
        window.clearInterval(timerInterval);
        startButton.innerHTML = 'start';
        var remainingTime = (endTime - currentTime + 1) * 1000;
        startButton.removeEventListener('click', toggleRunning);
        startButton.removeEventListener('touchstart', toggleRunning);
        startButton.addEventListener('click', timerRemainingTime);
        startButton.addEventListener('touchstart', timerRemainingTime);

        return null;
      }

      //CHECK FOR TIME IS UP
      displayCountdown(endTime);
      if (currentTime == endTime) {
        if (workOrBreak() == 'work') {
          workSeconds += duration / 1000;
          var workTime = toHourMin(workSeconds) + ' worked';
          displayText(workTime);
        }
        if (workOrBreak() == 'break') {
          displayText('end break');
        }

        startButton.innerHTML = 'start';
        beep();

        window.clearInterval(timerInterval);
        startButton.removeEventListener('click', timerRemainingTime);
        startButton.removeEventListener('touchstart', timerRemainingTime);
        startButton.addEventListener('click', startTimer);
        startButton.addEventListener('touchstart', startTimer);

        return null;
      }
    }, 1000);
  }

  var beep = function () {
    var beep_audio = new Audio('beep.mp3');
    beep_audio.play();
  }

  var toHourMin = function (secondsWorked) {
    var hours = Math.floor(secondsWorked / 3600);
    var minutes = Math.floor(secondsWorked % 3600) / 60;
    var time = '';

    if (minutes < 10) {
      minutes = minutes.toString();
      minutes = '0' + minutes;
    }
    time = hours + ':' + minutes;
    return time;
  }

  var displayCountdown = function (endTime) {

    var currentTime = getTimeInSeconds();
    var remainingTime = endTime - currentTime;

    remainingMinutes = Math.floor(remainingTime / 60);
    remainingSeconds = Math.floor(remainingTime % 60);

    if (remainingSeconds < 10) {
      remainingSeconds = remainingSeconds.toString();
      remainingSeconds = '0' + remainingSeconds;
    }

    var displayBlock = document.getElementById('display-area');
    displayBlock.innerHTML = remainingMinutes + ":" + remainingSeconds;
  }
}
