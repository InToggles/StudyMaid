// ======== VARIABLES ========= //

var today = new Date();
var hours = today.getHours()
var Interval; var TimerPaused
var path = "http://127.0.0.1:3000/"; // enter your server ip and port number

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
    }

    const c = document.getElementById('nav-links').appendChild(Divs).appendChild(a)
    c.appendChild(i)
    c.appendChild(span)
  }
}

// ======== CLASSES ========= //

// ======== LOAD PAGE ========= //

function LoadPage() {

  // Getting Display Data 
  var DisplayData

  CallServer({calltype: "HI"}, (response) => {
    console.log(response)
  })

  CallServer({type: "token", data: getCookie('token'), name: 'nil', calltype: "REQUEST"}, (response)=> {
    DisplayData = JSON.parse(response)
  })

  CallServer({id: DisplayData.id, calltype: "FINDCLASSES"}, (response)=> {
    var ParsedData = JSON.parse(response)
    console.log(ParsedData)
    for (var i = 0; i < ParsedData.length; i++) {

      // ===== Getting Class Settings ===== //
      var ClassData
      CallServer({ClassID: ParsedData[i].ClassID, calltype: "GETCLASSDATA"}, (callback) => {
        ClassData = JSON.parse(callback)
        console.log(ClassData)
      })

      // ===== Creating new elements ==== //
      const Div = document.createElement('div')
      Div.className = 'ClassElement'
      const ClassName = document.createElement('p')
      ClassName.innerHTML = ParsedData[i].classname
      ClassName.id = "ClassName"
      console.log(ClassName.innerHTML)
      const ClassDescription = document.createElement('p')
      ClassDescription.innerHTML = ClassData.ClassDescription
      const Box = document.getElementById('ClassBox').appendChild(Div)
      Box.appendChild(ClassName)
      Box.appendChild(ClassDescription)

      Box.addEventListener('click', function() {
        console.log('c')
        window.location.href = "/class/id="+ClassData.ClassID;
      })

    }
  })

  // Getting Display Data 

  if (DisplayData.token == getCookie('token')) {
    Show_Panel(DisplayData.rank)
  }
}

LoadPage()

/* ========= SIDE BAR CLOSING BUTTON ========= */
document.getElementById('closebutton').addEventListener("click", function() {
  document.getElementById('sidebar').classList.toggle('close')
})