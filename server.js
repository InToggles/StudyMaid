if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// ========= DECLARATIONS ========= //
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const jwt = require('jsonwebtoken')
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const { json } = require('body-parser')


const app = express()
const router = express.Router();

const User = require('./user.js');
const { request } = require('express')
const user = new User();


app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(cookieParser());
app.keys = ['dieueyf7huienejnfef']
app.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  signed: false,
  saveUninitialized: true,
  resave: true
}));



app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(methodOverride('_method'))

// ========= DIRECTORY DECLARATION ========= //

app.use(express.static('public'));
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/imgs', express.static(__dirname + 'public/imgs'))

// Body parser

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// ========= FUNCTIONS ========= //

function RequestData(Data, Field, Callback) {
  user.GetDataFromField(Data, Field, function(result) {
    if(result) {
      Callback(result[0])
    }
})  
}

// ========= CLIENT REQUEST HANDLER ========= //

app.post("/",  (req, res, next) => { 
  
  if (req.body)
  {
    if (req.body.calltype == "REQUEST" && !(req.body.type == "name" || req.body.type == "id")) { // REQUEST DATABASE
      RequestData(req.body.data, req.body.type, (result) =>{
        if(result) {
            res.send(JSON.stringify(result))
        }else {
          res.sendStatus(400);
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
    }
  }
})



// ========= ROUTER ========= //

router.get('/', (req, res, next) => {
  if(user) {
      res.redirect('/login');
      return;
  }
  res.render('Login.ejs');
})

// Main

app.get('/', (req, res) => {
  res.addHeader("Access-Control-Allow-Origin", "*");
  res.render('Home.ejs', {})
})

app.get('/login', (req, res) => {
    res.render("Login.ejs", {})
})

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

const HiddenPanels = express()

HiddenPanels.get('/admin', AuthToken,(req,res) => {
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

app.get('/logout', (req, res, next) => {
  res.cookie("token", "")
  res.redirect('/login')
})

app.use('/dashboard', HiddenPanels)

app.post('/login',(req, res, next) => {
    user.login(req.body.name, req.body.password, function(result) {

      if(result) {
        const token = jwt.sign({user: user}, process.env.SESSION_SECRET, {expiresIn: "1h"})

        user.GetDataFromField(req.body.name, "name", function(getfieldresult) {

          res.cookie("token", token)
          res.cookie("UserId", getfieldresult[0].id)

          user.Update(req.body.name, 'token', token)

          req.session.user = result;
          req.session.opp = 1;
          res.redirect("/dashboard")
        })
      }
  })
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

app.get('/study', AuthToken,(req, res, next) => {
  let user = req.session.user;

  if(user) {
    res.render("Study.html", {name: user.name})
      return;
  }
  res.render("login.ejs", {})
})

app.get('/Register', (req, res) => {
    res.render("Register.ejs")
})

app.post('/register', (req, res, next) => {
  let userInput = {
    name: req.body.name,
    password: req.body.password
  };
  user.CreateNewAccount(userInput, function(lastId) {
    if(lastId) {
        user.find(lastId, function(result) {
            req.session.user = result;
            req.session.opp = 0;
            res.render("Login.ejs", {})
        });

    }else {
        res.render("Login.ejs", {})
    }
  });
})

app.listen(3000, () => {

})
