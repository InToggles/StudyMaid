var today = new Date();
var hours = today.getHours()
var DisplayData
var path = "http://127.0.0.1:3000/"; // enter your server ip and port number

var message = ""

if (hours >= 0 && hours < 7) {
    message = "Good evening, ";
} else if (hours >= 7 && hours < 12) {
    message = "Good morning, ";
} else if (hours >= 12 && hours < 19) {
    message = "Good afternoon, "
} else if (hours >= 19) {
  message = "Good evening, "
} else {
  message = "Welcome back, "
}

function converttime(timeinseconds, callback) {
  const hrs = Math.floor(timeinseconds/3600)
  const mins = Math.floor((timeinseconds - (hrs * 3600))/60)
  const secs =  Math.floor(timeinseconds - ((hrs * 3600) + (mins * 60)))
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
        return c.substring(name.length, c.length);
      }
    }
    return "nil";
  }


  function CallServer(Data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText)
     }
  };
    request.open("POST", path, false); // true = asynchronous
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.send(JSON.stringify(Data))
  }

function Show_Panel(type) {
  if (type == "Admin" || type == "Developer" || type == "Teacher") {
    const Divs = document.createElement('li')
    const a = document.createElement('a')
    const i = document.createElement('i')
    const span = document.createElement('span')
    span.className = "link-name"
    i.className = "uil uil-chart"

    if (type == "Admin") {
      a.href = "/dashboard/admin"
      span.innerHTML = "Admin Panel"  
    } else if (type == "Teacher") {
      a.href = "/dashboard/teacher"
      span.innerHTML = "Teacher Panel" 
    }

    const c = document.getElementById('nav-links').appendChild(Divs).appendChild(a)
    c.appendChild(i)
    c.appendChild(span)
  }
}


if (message) {

  const quotes = [
    "One day, all your hard work will pay off.",
    "The earlier you start working on something, the earlier you will see results.",
    "Life is short. Live it. Fear is natural. Face it. Memory is powerful. Use it.",
    "You don’t have to be great to start. But you have to start to be great."
  ]

  var Message

  CallServer({type: "Token", data: getCookie('token'), field: 'Users/', calltype: "REQUEST"}, (response)=> {
    DisplayData = JSON.parse(response)
  })

  converttime(DisplayData.TotalStudyTime, (response) => {
    if (response.Hours < 0 && response.Minutes < 1 ){
      Message = response.Seconds + "S"
    } else if (response.Hours >= 1 && response.Minutes >= 1) {
      Message = response.Hours + "H " + response.Minutes + "M"
    } else if (response.Hours < 1 && response.Minutes >= 1) {
      Message = response.Minutes + "M"
    } else {
      Message = response.Seconds + "S"
    }
    document.getElementById('studytime').innerHTML = Message;
  })


  document.getElementById('greet').innerHTML = message + DisplayData.Name + ".";
  document.getElementById('qotd').innerHTML = "'" + quotes[Math.floor(Math.random() * (quotes.length))] + "'";
  document.getElementById('userrank').innerHTML = DisplayData.Role;
  if (DisplayData.Role == "Admin"){
    document.getElementById('userrankbox').style.backgroundColor = 'rgb(255, 66, 117)'
  } else if (DisplayData.Role == "Head Maid"){
    document.getElementById('userrankbox').style.backgroundColor = 'rgb(66, 255, 183)'
  }

  if (DisplayData.Token == getCookie('token')) {
    Show_Panel(DisplayData.Role)
  }
}

/* ========= SIDE BAR CLOSING BUTTON ========= */
document.getElementById('closebutton').addEventListener("click", function() {
  document.getElementById('sidebar').classList.toggle('close')
})