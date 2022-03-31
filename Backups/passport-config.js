const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, getUserById) {

  

    const authenticateUser = async (name, password, done) => {
        const user = getUserByName(name)
        if (user == null) {
            console.log('no user found')
          return done(null, false, { message: 'No user with that name.' })
        
        } else {
            console.log('user found')
        }
    
        try {
          if (await bcrypt.compare(password, user.password)) {
              console.log('password correct')
            return done(null, user)
          } else {
            return done(null, false, { message: 'Password incorrect' })
          }
        } catch (e) {
          return done(e)
        }
      }

    passport.use(new LocalStrategy({ usernameField: 'name' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        return done(null, getUserById(id))
    })
}

module.exports = initialize
/* 
.selectors button, #logout{
	width: 100%;
	height: 40px;
	color: rgb(255, 255, 255);
	background-color: transparent;
	border-style: none;
	text-decoration: none;
	font-size: 15px;
	text-align: left;
	padding-left: 40px;
	font-family: 'Varela Round', sans-serif;
	cursor: pointer;
}
*/