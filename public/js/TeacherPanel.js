/* const Interval = setInterval(ChangeTimer, 1000); */

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

function CallServer(Data, callback) {
  var request = new XMLHttpRequest();
  var path = "https://studymaid.herokuapp.com/"; // enter your server ip and port number
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
      a.href = "#"
      span.innerHTML = "Admin Panel"  
    } else if (type == "Teacher") {
      a.href = "#"
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

function UpdateUserProfilePage(ProfileData) {

  document.getElementById('userprofileheader').innerHTML = "Name : " + ProfileData.name
  document.getElementById('userprofilerank').innerHTML = "User Rank : " + ProfileData.rank
  var TimeData
  converttime(ProfileData.totalstudytime, (Data) => {
    TimeData = Data
  })
  document.getElementById('userprofiletotalstudytime').innerHTML = "Time Spent Studying : " + TimeData.Hours + "H " + TimeData.Minutes + "M "+ TimeData.Seconds + "S "

}

// ======== LOAD PAGE ========= //

function LoadPage() {

  // Getting Display Data 
  var DisplayData

  CallServer({type: "token", data: getCookie('token'), name: 'nil', calltype: "REQUEST"}, (response)=> {
    DisplayData = JSON.parse(response)
  })

  CallServer({type: "ClassOwnerID", data: DisplayData.id, name: 'nil', calltype: "GETCLASSESWITHOWNERID"}, (response)=> {
    var parsedResults = JSON.parse(response)
    for (let i = 0; i < parsedResults.length; i++) {
      const button = document.createElement('button')
      button.innerHTML = parsedResults[i].ClassName
      document.getElementById('Classes').appendChild(button)
      button.addEventListener("click", function() {
        document.getElementById('Classes').hidden = true
        CallServer({type: "ClassID", data: parsedResults[i].ClassID, name: 'nil', calltype: "GETCLASSATTENDEES"}, (response2)=> {
          if (response2 != "No data found") {
          var ParsedResponse = JSON.parse(response2)
          document.getElementById('ClassAttendees').innerHTML = ""
          for (let i = 0; i < ParsedResponse.length; i++) {
            const p = document.createElement('p')
            p.innerHTML = ParsedResponse[i].name
            document.getElementById('ClassAttendees').appendChild(p)
          }
          } else {
            const p = document.createElement('p')
            p.innerHTML = 'No students found'
            document.getElementById('ClassAttendees').appendChild(p)
          }
        })
        document.getElementById('ClassAttendees').hidden = false
      })
    }
  })

  //CallServer({type:'nil', data: 'nil', name: 'nil', calltype: 'CREATENEWCLASS'}, (results) => {
    //console.log(results)
  //})

  // Getting Display Data 

  if (DisplayData.token == getCookie('token')) {
    Show_Panel(DisplayData.rank)
  }

}

LoadPage()
