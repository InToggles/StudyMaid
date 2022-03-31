if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const mysql = require('mysql')
const database = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
})

database.connect((error) => {
  if (error) {
    throw error;
  }

  console.log('Connected to Database.')

})

const initializePassport = require('./passport-config.js')
initializePassport(
    passport,
    name => users.find(user => user.name === name),
    id => users.find(user => user.id === id)
)
  
const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/imgs', express.static(__dirname + 'public/imgs'))

app.get('/', (req, res) => {
    req.logOut()
    res.render('Home.ejs', {})
})

app.get('/login', (req, res) => {
    req.logOut()
    res.render("Login.ejs", {})
}) 

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile.ejs', { name: req.user.name })
  })

app.get('/Register', (req, res) => {
    req.logOut()
    res.render("Register.ejs", {})
}) 

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            password: hashedPassword
        })
        res.redirect('/Login')
    } catch {
        res.redirect('/Register')
    }
    console.log(users)
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
      console.log('not authenticated')
    if (req.isAuthenticated()) {
    console.log(req, res, next)
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
      console.log('testtss')
    if (req.isAuthenticated()) {
      return res.redirect('/Profile')
    }
    next()
  }

//app.listen(3000, () => {

//})
