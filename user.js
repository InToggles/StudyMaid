const pool = require('./pool');
const bcrypt = require('bcrypt');


function User() {};

User.prototype = {

    // =========== DEFAULT FUNCTIONS =========== //

    find : function(user = null, callback)
    {
        if(user) {
            var field = Number.isInteger(user) ? 'id' : 'name';
        }
        let sql = `SELECT * FROM users WHERE ${field} = ?`;


        pool.query(sql, user, function(err, result) {
            if(err) {
                callback(null)
                return
            }

            if(result.length && !err) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    Update : function(User, FieldName, UpdatedValue, callback) {
        if (User) {
            var field = Number.isInteger(User) ? 'id' : 'name';
            var id
            this.GetDataFromField(User, 'name', function(result) {
                id = result[0].id
                let sql = `UPDATE users SET ${FieldName} = '${UpdatedValue}' WHERE users. id = ${id};`;
                pool.query(sql,function(err, result) {
                    if(err) throw err
                });
            })

        }
    },

    login : function(username, password, callback) {
        this.find(username, function(user) {
            if(user) {
                if(bcrypt.compareSync(password, user.password)) {
                    callback(user);
                    return;
                }
            }
            // if the username/password is wrong then return null.
            console.log('User entered the wrong password.')
            callback(null);
        });
    },

    // =========== CALL FROM USERS FUNCTION =========== //

    GetDataFromField : function(User, FieldName, callback) {
        if (User) {
            let sql = `SELECT * FROM users WHERE ${FieldName} = '${User}' `;

            pool.query(sql, User, function(err, result) {
                if(err) throw err
                if(result.length) {
                    callback(result);
                }else {
                    callback(null);
                }
            });

        }
    },

    SpecialQuery : function(callback) {
        let sql = `SELECT * FROM users`;

        pool.query(sql, function(err, result) {
            if(err) throw err
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });

    },

    // =========== CALL FROM CLASSES FUNCTION =========== //

    GetClassesWithOwnerID : function(ID, FieldName, callback) {
        let sql = `SELECT * FROM classes WHERE ${FieldName} = ${ID} `;

        pool.query(sql, ID, function(err, result) {
            if(err) throw err
            if(result.length) {
                callback(result);
            } else {
                callback(null);
            }
        });

    },

    CreateNewClass : function(body, callback) {
        var bind = [
                "Test Class 5",
                762456245,
                "Teacher1",
                17
            ];
            let sql = `INSERT INTO classes(ClassName, ClassID, ClassOwner, ClassOwnerID) VALUES (?, ?, ?, ?)`;
            pool.query(sql, bind, function(err, result) {
                if(err) throw err;
                callback("success")
                console.log("Successfully created a new user.")
            });

    },

    // =========== CALL FROM CLASSATTENDEES FUNCTION =========== //

    GetClassAttendees : function(ClassID, FieldName, callback) {
            let sql = `SELECT * FROM classattendees WHERE ${FieldName} = '${ClassID}' `;
            pool.query(sql, ClassID, function(err, result) {
                if(err) throw err
                if(result.length) {
                    callback(result);
                }else {
                    callback(null);
                }
            });

    },

    CreateNewAccount : function(body, callback) 
    {

        this.find(body.name, function(user) {
            if(!user) {
                var pwd = body.password;
                body.password = bcrypt.hashSync(pwd,10);

                var bind = [];
                for(prop in body){
                    bind.push(body[prop]);
                }
                bind.push("Default")
                let sql = `INSERT INTO users(name, password, rank) VALUES (?, ?, ?)`;
                pool.query(sql, bind, function(err, result) {
                    if(err) throw err;
                    console.log("Successfully created a new user.")
                    callback(result.insertId);
                });
            }else{
                console.log("User is already found within the Database.")
                callback(null);
            }
        });
    },

    FindUsersInClass : function(user, classid, callback)
    {
        if(user && classid) {
        let sql = `SELECT * FROM classattendees WHERE classID = ${classid} AND id = ${user}`;


        pool.query(sql, user, function(err, result) {
            console.log(sql)
            if(err) {
                callback(null);
                throw err
            }

            if(result.length) {
                callback('found');
            }else {
                callback(null);
            }
        });

        } else {
            callback(null)
    }
    },

    FindUserClasses : function(user, callback)
    {
        if(user) {
        let sql = `SELECT * FROM classattendees WHERE id = ${user}`;


        pool.query(sql, user, function(err, result) {
            if(err) {
                callback(null);
                throw err
            }

            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });

        } else {
            callback(null)
    }
    },

    GetClassData : function(ClassID, callback)
    {
        if(ClassID) {
        let sql = `SELECT * FROM classes WHERE ClassID = ${ClassID}`;


        pool.query(sql, ClassID, function(err, result) {
            console.log(ClassID )
            if(err) {
                callback(null);
                throw err
            }

            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });

        } else {
            callback(null)
    }
    },

}

module.exports = User;