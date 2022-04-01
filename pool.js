const util = require('util');
const mysql = require('mysql');
/** Connection to the database.**/
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_PASSWORD,
    password: process.env.DB_USER,
    database: process.env.DATABASE,
});

pool.getConnection((error, connection) => {
    if(error) 
    console.log(pool)
        console.error("There was an error connecting to Database.", error);
    
    if(connection)
    console.log("Successfully connected to the Database!")
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;