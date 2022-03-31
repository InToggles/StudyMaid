const util = require('util');
const mysql = require('mysql');
console.log(process.env.DATABASE_HOST2, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD)
/** Connection to the database.**/
const pool = mysql.createPool({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b3096bc9773b7e',
    password: '3a6acd58',
    database: "heroku_2a0b36d47694a4d",
});

console.log(pool, "asjdjdjsjjsjs")

pool.getConnection((error, connection) => {
    if(error)
    console.log(connection)
        console.error("There was an error connecting to Database.", error);
    
    if(connection)
    console.log("Successfully connected to the Database!")
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;