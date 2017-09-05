var workSeconds = 0;

var startButton = document.getElementById('start-button')
var startTimer = function(){
  timer(userDuration())
}
startButton.addEventListener('click', startTimer )
startButton.addEventListener('touchstart', startTimer )


var rads = document.getElementById("rad-buttons")
var userDuration = function(){  
  for (var elem of rads){
    if(elem.checked){
      displayText(elem.value + ' mins')
      return elem.value * 60000 
    }
  }
}
rads.addEventListener('change', userDuration)


var breakRads = document.getElementById("break-rads")
var workOrBreak = function(){  
  for (var elem of breakRads){
    if(elem.checked){
      return elem.value 
    }
  }
}
breakRads.addEventListener('change', workOrBreak)

var getTimeInSeconds = function(){
  var currentTime = new Date()
  currentTime = currentTime.getTime() 
  return Math.floor(currentTime / 1000)
}


var timer = function(duration){
  
  startButton.innerHTML = 'pause'  
  
  var running = true
  var startTime = getTimeInSeconds()
  var endTime = startTime + (duration/1000)

  startButton.onclick = () => running = !running
  startButton.addEventListener('touchstart', () => running = !running, false )

  var resetButton = document.getElementById("reset")   
  resetButton.onclick = function() {
    resetSession()
  }

  resetButton.addEventListener('touchstart', function() {
    resetSession()
  } , false )

  //RESET
  var resetSession = function(){
    window.clearInterval(timerInterval)      
    startButton.innerHTML = 'start'
    displayText('restart')
    startButton.onclick = () => timer(userDuration())
    startButton.addEventListener('touchstart',startTimer, false )
  }

  

  var timerInterval = window.setInterval(function(){
    var currentTime = getTimeInSeconds()
    //PAUSE
    if(!running){
      window.clearInterval(timerInterval)
      startButton.innerHTML = 'start'
      var remainingTime = ( endTime - currentTime + 1 ) * 1000
      startButton.onclick = () => timer(remainingTime)
      startButton.addEventListener('click', timerRemainingTime, false)
      return null
    }

    var timerRemainingTime = function(){
      timer(remainingTime)
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
      startButton.addEventListener('touchstart', startTimer, false )
      
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
  var minutes = Math.floor(secondsWorked % 3600) / 60
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

