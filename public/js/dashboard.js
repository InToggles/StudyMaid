var today = new Date();
var hours = today.getHours()
var DisplayData

var message = ""

if (hours >= 0 && hours < 7) {
    message = "Good evening, ";
} else if (hours >= 7 && hours < 12) {
    message = "Good morning, ";
} else if (hours >= 12 && hours < 19) {
    message = "Good afternoon, "
} else if (hours > 19) {
  message = "Good evening, "
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
    console.log(this)
    if (this.readyState == 4 && this.status == 200) {
      console.log('fasdg')
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
    i.className = "uil uil-chart"

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

if (message) {

  console.log('c')

  const quotes = [
    "One day, all your hard work will pay off.",
    "The earlier you start working on something, the earlier you will see results.",
    "Life is short. Live it. Fear is natural. Face it. Memory is powerful. Use it.",
    "You don’t have to be great to start. But you have to start to be great."
  ]

  var Message

  GetUserDisplayData((response)=>{
    DisplayData = JSON.parse(response)
  })

  console.log(DisplayData)

  converttime(DisplayData.totalstudytime, (response) => {
    console.log(response)
    if (response.Hours < 0 && response.Minutes < 1 ){
      Message = response.Seconds + "S"
      console.log(Message)
    } else if (response.Hours >= 1 && response.Minutes >= 1) {
      Message = response.Hours + "H " + response.Minutes + "M"
    } else if (response.Hours < 1 && response.Minutes >= 1) {
      Message = response.Minutes + "M"
    } else {
      Message = response.Seconds + "S"
    }
    console.log(Message)
    document.getElementById('studytime').innerHTML = Message;
  })

  console.log(DisplayData)

  document.getElementById('greet').innerHTML = message + DisplayData.name + ".";
  document.getElementById('qotd').innerHTML = "'" + quotes[Math.floor(Math.random() * (quotes.length))] + "'";
  document.getElementById('userrank').innerHTML = DisplayData.rank;
  if (DisplayData.rank == "Admin"){
    document.getElementById('userrankbox').style.backgroundColor = 'rgb(255, 66, 117)'
  } else if (DisplayData.rank == "Head Maid"){
    document.getElementById('userrankbox').style.backgroundColor = 'rgb(66, 255, 183)'
  } else if (DisplayData.rank == "Faith"){
    document.getElementById('userrankbox').style.backgroundColor = 'rgb(0, 255, 149)'
  }

  if (DisplayData.token == getCookie('token')) {
    Show_Panel(DisplayData.rank)
  }

  function generate() {
    let id = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
      console.log(id())
    }

    generate()
}

/* const Interval = setInterval(ChangeTimer, 1000); */