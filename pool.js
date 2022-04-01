const util = require('util');
const mysql = require('mysql');
/** Connection to the database.**/
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST2,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

pool.getConnection((error, connection) => {
    if(error) 
        console.error("There was an error connecting to Database.", error);
    
    if(connection)
    console.log("Successfully connected to the Database!")
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;