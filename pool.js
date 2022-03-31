const util = require('util');
const mysql = require('mysql');
/** Connection to the database.**/
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
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