const Firebase = require('firebase-admin')
var serviceAccount = require("./serviceAccountKey.json");

const bcrypt = require('bcrypt');
const User = require('../user');

const app = Firebase.initializeApp(firebaseConfig = {
    credential: Firebase.credential.cert(serviceAccount),

    databaseURL: "https://studymaid-24d6b-default-rtdb.asia-southeast1.firebasedatabase.app"
})

const Database = Firebase.database()

module.exports = {
    RegisterAccount: function(req, callback) {
        this.FindData({
            field: 'Users/Admin'
        }, (results) => {
            if (results == null) {
            Database.ref('Users/'+req.name).set({
                Name: req.name,
                Email: req.email,
                Role: req.accounttype,
                Password: bcrypt.hashSync(req.password,10),
                Token: '',
                TotalStudyTime: 0,
            })
    
            callback('success', {'statuscode':200, 'message':"Successfully added new account"})
        } else {
            callback('failed', {'statuscode':406, 'message':"Not found."})
        }
        })
    },

    FindData: function(req, callback) {
        var Data = Database.ref(req.field).once('value', function (snapshot) {
            const results = snapshot.val()
            callback(results)
        })
    },

    Update: function(target, data) {
        Database.ref(target).update(data)
    },

    Login: function(Data, callback) {
        this.FindData({
            field: 'Users/'+Data.Name
        }, (results) => {
            console.log(results)
            if (bcrypt.compareSync(Data.Password, results.Password)) {
                callback(true)
                return
            }
            console.log('entered wrong password.')
        })
    },

}

