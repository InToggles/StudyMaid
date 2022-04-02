// ======== VARIABLES ========= //

var today = new Date();
var hours = today.getHours()
const path = "https://studymaid.herokuapp.com/"; // enter your server ip and port number

var Interval; var TimerPaused

// ======== FUNCTIONS ========= //

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
    i.className = "uil uil-lock-access"

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

// ======== LOAD PAGE ========= //

function LoadPage() {

  // Getting Display Data 
  var DisplayData

  CallServer({type: "token", data: getCookie('token'), name: 'nil', calltype: "REQUEST"}, (response)=> {
    DisplayData = JSON.parse(response)
  })

  document.getElementById('AnnouncementsButton').addEventListener('click', function() {
    document.getElementById('Announcements').hidden = false
    document.getElementById('Assignments').hidden = true
  })

  document.getElementById('AssignmentsButton').addEventListener('click', function() {
    document.getElementById('Announcements').hidden = true
    document.getElementById('Assignments').hidden = false
  })

}

LoadPage()
