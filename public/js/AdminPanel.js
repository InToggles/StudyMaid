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
  var SendData = {
    data: Data.data,
    type: Data.type,
    name: Data.name,
    calltype: Data.calltype
  }
  request.send(JSON.stringify(SendData))
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

  // Getting Display Data 

  if (DisplayData.token == getCookie('token')) {
    Show_Panel(DisplayData.rank)
  }

  CallServer({type:'nil', data: 'nil', name: 'nil', calltype: 'GETALLUSERS'}, (results) => {
    const ParsedResults = JSON.parse(results)
    for (let i = 0; i < JSON.parse(results).length; i++) {
      console.log(ParsedResults[1])
      const Paragraph = document.createElement('button')
      const div = document.createElement('div')
      Paragraph.innerHTML = ParsedResults[i].name
      Paragraph.id = ParsedResults[i].name
      Paragraph.className = 'button'
      document.getElementById('userlist').appendChild(div).appendChild(Paragraph)
      Paragraph.addEventListener("click", () => {
        document.getElementsByClassName('UserProfile').id = ParsedResults[i].name
        UpdateUserProfilePage(ParsedResults[i])
        document.getElementById('overlay').hidden = false
      })
    } 
  })



  document.getElementById('closeuserprofile').addEventListener("click", () => {
    console.log('sds')
    document.getElementById('overlay').hidden = true
  })

  document.getElementById('changeuserrole').addEventListener("click", () => {
    var RankSelector = document.getElementById('rank');
    var Rank = RankSelector.options[RankSelector.selectedIndex].text;
    var SelectedUser = document.getElementsByClassName('UserProfile').id
    console.log(SelectedUser)
    if (SelectedUser) {
      CallServer({data: Rank, type: "rank", name: SelectedUser, calltype: "UPDATE"}, (callback) => {
        if (callback) {
          console.log('Successfully updated user data.')
          document.getElementById('userprofilerank').innerHTML = "User Rank : " + Rank
        } else {
          console.log('Error occured during updating user rank. 2')
        }
      })
    } else {
      console.log('Error occured during updating user rank.')
    }
  })

}

LoadPage()
