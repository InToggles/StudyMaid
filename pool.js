const util = require('util');
const mysql = require('mysql');
console.log(process.env.DB_USER, process.env.DB_HOST, process.env.DB_PASSWORD)
/** Connection to the database.**/
const pool = mysql.createPool({
    host: process.env.DB_USER,
    user: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
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