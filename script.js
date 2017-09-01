var rads = document.getElementById("rad-buttons")
var resetButton = document.getElementById("reset") 
var breakRads = document.getElementById("break-rads")
var workSeconds = 0;

var userDuration = function(){  
  for (var elem of rads){
    if(elem.checked){
      displayText(elem.value + ' mins')
      return elem.value * 60000 
    }
  }
}

var workOrBreak = function(){  
  for (var elem of breakRads){
    if(elem.checked){
      return elem.value 
    }
  }
}

breakRads.onchange = workOrBreak 
rads.onchange = userDuration

var startButton = document.getElementById('start-pause')

startButton.onclick = () => timer(userDuration())

var getTimeInSeconds = function(){
  var currentTime = new Date()
  currentTime = currentTime.getTime() 
  return Math.floor(currentTime / 1000)
}


var timer = function(duration){
  //check if work or break
  startButton.innerHTML = 'pause'  
  
  var running = true
  var reset = false
  var startTime = getTimeInSeconds()
  var endTime = startTime + (duration/1000)

  startButton.onclick = () => running = !running
  resetButton.onclick = function() {
    reset = true
    resetSession()
  }
  //RESET
  var resetSession = function(){
    window.clearInterval(timerInterval)      
    startButton.innerHTML = 'start'
    displayText('restart')
    startButton.onclick = () => timer(userDuration())
  }

  

  var timerInterval = window.setInterval(function(){
    var currentTime = getTimeInSeconds()
    //PAUSE
    if(!running){
      window.clearInterval(timerInterval)
      startButton.innerHTML = 'start'
      var remainingTime = ( endTime - currentTime + 1 ) * 1000
      startButton.onclick = () => timer(remainingTime)
      return null
    }

    displayCountdown(endTime)
    //END
    if ( currentTime == endTime ) {
      if(workOrBreak() == 'work') {
        workSeconds += duration / 1000
        var workTime = toHourMin(workSeconds) + ' worked'
        displayText(workTime)
      }
      if(workOrBreak() == 'break') {
        displayText( 'end break')
      }
      
      startButton.innerHTML = 'start'
      beep()
      //handle work or break
      
      window.clearInterval(timerInterval)
      startButton.onclick = () => timer(userDuration())
      return null
    }
  } , 1000)
}

var beep = function(){
  var beep_audio = new Audio('beep.mp3')
  beep_audio.play()
}

var toHourMin = function(secondsWorked){
  var hours = Math.floor(secondsWorked / 3600)
  var minutes = Math.floor(secondsWorked / 60)
  var time = ''

  if (minutes < 10){
    minutes = minutes.toString()
    minutes = '0' + minutes
  }
  time = hours + ':' + minutes
  return time
}

var displayCountdown = function(endTime){
  
  var currentTime = getTimeInSeconds()
  var remainingTime = endTime - currentTime
  
  remainingMinutes = Math.floor(remainingTime / 60)
  remainingSeconds = Math.floor(remainingTime % 60)

  if (remainingSeconds < 10){
    remainingSeconds = remainingSeconds.toString()
    remainingSeconds = '0' + remainingSeconds
  }

  var displayBlock = document.getElementById('display-area')
  displayBlock.innerHTML = remainingMinutes + ":" + remainingSeconds 
}

var displayText = function(string){
  var displayBlock = document.getElementById('display-area')
  displayBlock.innerHTML = string 
}


//WORK BREAK TOGGLE FUNCTION 





