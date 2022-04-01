// ======== VARIABLES ========= //

var today = new Date();
var hours = today.getHours()

var Interval; var TimerPaused

// ======== FUNCTIONS ========= //

function converttime(timeinseconds, callback) {
  var hrs = Math.floor(timeinseconds/3600)
  var mins = Math.floor((timeinseconds - (hrs * 3600))/60)
  var secs =  Math.floor(timeinseconds - ((hrs * 3600) + (mins * 60)))
  if (mins < 10) {
    mins = "0" + mins
  }
  if (secs < 10) {
    secs = "0" + secs
  }
  const timestudied = {
    Hours: hrs,
    Minutes: mins,
    Seconds: secs
  }

  callback(timestudied)
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        console.log('got cookie')
        return c.substring(name.length, c.length);
      }
    }
    return "nil";
  }

function GetUserDisplayData(_callback) {
  var request = new XMLHttpRequest();
  var path = "https://studymaid.herokuapp.com/"; // enter your server ip and port number
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      _callback(this.responseText)
   }
};
  request.open("POST", path, false); // true = asynchronous
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  var data = {
    data: getCookie('token'),
    type: "token",
    calltype: "REQUEST"
  }
  request.send(JSON.stringify(data))
}

function Show_Panel(type) {
  if (type == "Admin" || type == "Developer" || type == "Teacher") {
    const Divs = document.createElement('li')
    const a = document.createElement('a')
    const i = document.createElement('i')
    const span = document.createElement('span')
    span.className = "link-name"
    i.className = "uil uil-lock-access"

    if (type == "Admin") {
      a.href = "dashboard/admin"
      span.innerHTML = "Admin Panel"  
    } else if (type == "Teacher") {
      a.href = "dashboard/teacher"
      span.innerHTML = "Teacher Panel" 
    }

    const c = document.getElementById('nav-links').appendChild(Divs).appendChild(a)
    c.appendChild(i)
    c.appendChild(span)
  }
}

function timerrunout() {
  clearInterval(Interval)
  document.getElementById('countdownsettings').hidden = false;
  document.getElementById('cdtime').hidden = true;
  document.getElementById('starttimer').hidden = false;
  document.getElementById('endtimer').hidden = true;
}

// ======== CLASSES ========= //

class clock {

  start() {
    setInterval(() => {
      this.UpdateMainClock()
    }, 500);
  }

  startcountdown(time) {
    var totaltime = time
    this.updatecountdown(totaltime)
    Interval = setInterval(() => {
      this.updatecountdown(totaltime)
      if (!TimerPaused) {
        totaltime = totaltime - 0.5
        if (totaltime < 0) {
          clearInterval(Interval)
          document.getElementById('cdtime').innerHTML = "Timer ended!"
        }
      }
    }, 500);
  }

  updatecountdown(totaltime) {
    converttime(Math.floor(totaltime), (callback) => {
      document.getElementById('cdtime').innerHTML = callback.Hours + ":" + callback.Minutes + ":" + callback.Seconds
    })
    
  }

  UpdateMainClock() {
    var Time = new Date();
    document.getElementById("currenttime").firstChild.nodeValue = Time.toLocaleTimeString();
  }

}

// ======== LOAD PAGE ========= //

function LoadPage() {

  // Getting Display Data 
  var DisplayData

  GetUserDisplayData((response)=>{
    DisplayData = JSON.parse(response)
  })

  // Getting Display Data 

  if (DisplayData.token == getCookie('token')) {
    Show_Panel(DisplayData.rank)
  }

  // Timer system
  
  const Clock = new clock;
  Clock.start()

  // StartTimer click function
  
  document.getElementById('starttimer').addEventListener("click", function(){
    document.getElementById('countdownsettings').hidden = true;
    var hr = document.getElementById('hrinput').value; var min = document.getElementById('mininput').value; var sec = document.getElementById('secinput').value;
    if (hr > 24) {
      hr = 24
    } else if (hr < 0) {
      hr = 0
    }
    if (min > 60) {
      min = 60
    } else if (min < 0) {
      min = 0
    }
    if (sec > 60) {
      sec = 24
    } else if (sec < 0) {
      sec = 0
    }
    const totaltime = parseInt(hr * 3600) + parseInt(min * 60) + parseInt(sec)
    console.log((hr * 3600) + (min * 60) + sec)
    console.log((hr * 3600), (min * 60), sec)
    Clock.startcountdown(totaltime)
    Clock.updatecountdown(totaltime)
    document.getElementById('cdtime').hidden = false;
    document.getElementById('endtimer').hidden = false;
    document.getElementById('pausetimer').hidden = false;
    document.getElementById('starttimer').hidden = true;

  });

  // EndTimer click function

  document.getElementById('endtimer').addEventListener("click", function(){
    timerrunout()
  });

  // PauseTimer click function

  document.getElementById('pausetimer').addEventListener("click", function(){
      TimerPaused = !TimerPaused
      if (TimerPaused) {
        document.getElementById('pausetimer').innerHTML = "UNPAUSE"
      } else {
        document.getElementById('pausetimer').innerHTML = "PAUSE"
      }
  });

}

LoadPage()
