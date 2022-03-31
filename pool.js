const util = require('util');
const mysql = require('mysql');
/** Connection to the database.**/
const pool = mysql.createPool({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b3096bc9773b7e',
    password: '3a6acd58',
    database: 'heroku_2a0b36d47694a4d',

});

pool.getConnection((error, connection) => {
    if(error) {
        console.error("There was an error connecting to Database.", error); 
    }
    
    if(connection) {
        console.log("Successfully connected to the Database!")
        connection.release();
    return;
    }

});

pool.query = util.promisify(pool.query);

module.exports = pool;