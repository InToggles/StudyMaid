if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// ========= Modules ========= //
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const jwt = require('jsonwebtoken')
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const { json } = require('body-parser')

// ========= INITIALIZATION ========= //

const app = express()
const HiddenPanels = express()
const User = require('./user.js');
const user = new User();

app.use(cookieParser())
app.use(cookieSession({
secret: process.env.SESSION_SECRET,
saveUninitialized: true,
resave: true
}));

app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile);

// ========= FIREBASE ========== //
const Firebase = require('./Firebase/FirebaseHandler')

// ========= DIRECTORY DECLARATION ========= //

app.use(express.static('public'));
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/imgs', express.static(__dirname + 'public/imgs'))

// ======== BODY PARSER ========= //

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// ========= FUNCTIONS ========= //

function RequestData(Data, Field, Callback) {
  user.GetDataFromField(Data, Field, function(result) {
    if(result) {
      Callback(result[0])
    } else {
      Callback(null)
    }
})  
}

function AuthToken(req, res, next) {
  const token = req.cookies.token
  try {
    const userbeingverified = jwt.verify(token, process.env.SESSION_SECRET)
    req.user = userbeingverified;
    next();
  } catch (err) {
    res.clearCookie("token")
    return res.redirect('/login')
  }
}

function AuthUserAccessPrivilege(Request, AuthorisedRank, callback) {
  RequestData(Request.cookies.token, 'token', (result) =>{
    if(result && result.rank == AuthorisedRank) {
      callback(true)
    } else {
      callback(false)
    }
  })
}

// ========= CLIENT REQUEST HANDLER ========= //

app.post("/",  (req, res, next) => { 

  if (req.body)
  {
    if (req.body.calltype == "REQUEST") { // REQUEST DATABASE
      Firebase.FindData(req.body, (results) => {
        for (let i in results) {
          if (results[i][req.body.type] == req.body.data) {
            var FoundData = results[i]
            FoundData.Password = ""
            res.send(JSON.stringify(FoundData))
            return
          }
          res.sendStatus(400)
        }
      })
    } else if (req.body.calltype == "UPDATE") { // UPDATE DATABASE
      user.Update(req.body.name, req.body.type, req.body.data);
      res.sendStatus(200);
    } else if (req.body.calltype == "GETALLUSERS") { // REQUEST ALL USERS FROM DATABASE
      user.SpecialQuery((callback) => {
        for (const data of callback) {
          data.password = ""
        }
        res.send(JSON.stringify(callback))
      })
    } else if (req.body.calltype == "CREATENEWCLASS") { // CREATES NEW CLASS
      user.CreateNewClass({}, (callback) => {
        if (callback == "success") {
          res.send("CREATED.")
        }
      })
    } else if (req.body.calltype == "GETCLASSESWITHOWNERID") { // FIND CLASSES WITH SPECIFIED OWNER ID
      user.GetClassesWithOwnerID(req.body.data, req.body.type, (result) => {
        if(result) {
            res.send(JSON.stringify(result))
        }else {
          res.send("No data found")
        }
      })
    } else if (req.body.calltype == "GETCLASSATTENDEES") { // FIND STUDENTS WITH SPECIFIED CLASS ID
      user.GetClassAttendees(req.body.data, req.body.type, (result) => {
        if(result) {
            res.send(JSON.stringify(result))
        }else {
          res.send("No data found")
        }
      })
    } else if (req.body.calltype == "FINDCLASSES") { // FINDS THE CLASSES THE STUDENTS ARE IN
        user.FindUserClasses(req.body.id, (callback) => {
            if (callback) {
              res.send(callback)
            } else {
              res.send(null)
            }
        })
      } else if (req.body.calltype == "GETCLASSDATA") { // Gets the description of the class
        user.GetClassData(req.body.ClassID, (callback) => {
            if (callback) {
              res.send(callback[0])
            } else {
              res.send(null)
            }
        })
      } else if (req.body.calltype =="HI") {
        console.log('hello.')
        res.send('cock.')
      }
  }
})

// ========= ROUTING =========== //

app.get('/', (req, res) => {
  res.render('Home.ejs', {})
})

app.get('/login', (req, res) => {
  res.render("Login.html", {})
})

app.get('/logout', (req, res, next) => {
  res.cookie("token", "")
  res.redirect('/login')
})

app.get('/dashboard', AuthToken,(req, res, next) => {
  let user = req.session.user;

  if(user) {
    res.render("Dashboard.html", {name: user.name})
      return;
  }
  res.render("login.ejs", {})
})

app.get('/settings', AuthToken,(req, res, next) => {
  let user = req.session.user;

  if(user) {
    res.render("Settings.ejs", {name: user.name})
      return;
  }
  res.render("login.ejs", {})
})

app.get('/study', AuthToken, (req, res, next) => {
  let user = req.session.user;

  if(user) {
    res.render("Study.html", {name: user.name})
      return;
  }
  res.render("login.ejs", {})
})

app.get('/Register', (req, res) => {
  res.render("Register.html")
})

app.get('/class', AuthToken, (req, res, next) => {
  res.render('classpage.html')
})

app.get('/class/id=*', AuthToken, (req, res, next) => {
  const token = req.cookies.token
  console.log('grapeeee')
  RequestData(token, 'token', (result) =>{
    if(result) {
      user.FindUsersInClass(result.id, req.url.split('id=')[1], (callback) => {
        if (callback) {
          console.log('grapeeee')
          res.render('class2.html')
        } else {
          res.redirect('/class')
        }
      })
    }
  })
})

// ========== APP POSTS =========== //

app.post('/register', (req, res, next) => {

 Firebase.RegisterAccount(req.body, (callback) => {
    if (callback=='success') {
      res.redirect("/Login")
    }
  })
})

app.post('/login',(req, res, next) => {

  const token = jwt.sign({user: user}, process.env.SESSION_SECRET, {expiresIn: '1H'})

  Firebase.Login({
    Name: req.body.name,
    Password: req.body.password
  }, (callback) => {
    if (callback == true) {
      Firebase.Update('Users/'+req.body.name, {
        Token: token
      })
      res.cookie("token", token)
      res.redirect("/dashboard")
    }
  })
})

// ========== HIDDEN PAGES ============ //

HiddenPanels.get('/admin', AuthToken, (req,res) => {
  AuthUserAccessPrivilege(req, "Admin", (callback) => {
    if (callback == true) {
      res.render('AdminDashboard.html')
    } else {
      res.redirect('/dashboard')
    }
  })
})

HiddenPanels.get('/teacher', AuthToken,(req,res) => {
  AuthUserAccessPrivilege(req, "Teacher", (callback) => {
    if (callback == true) {
      res.render('TeacherDashboard.html')
    } else {
      res.redirect('/dashboard')
    }
  })
})

app.use('/dashboard', HiddenPanels)

// ========== LISTEN TO URL + PORT ============ //

app.listen(process.env.PORT, () => {
  console.log('Successfully connected to application with : ' + process.env.PORT)
})
