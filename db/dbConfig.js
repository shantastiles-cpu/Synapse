const sql = require('mssql');
require('dotenv').config();

console.log('DB_SERVER from env', process.env.DB_SERVER);

const dbConfig = { // the values for these are saved in a different file to provide security
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        trustServerCertificate: true
    }
}

async function connectDB() { // create function called connectDB that is allowed to run asynchronously, allowing multiple requests to be active
    try { // try-catch block, tries something, if something goes wrong, catch it and throw something.
        const pool = await sql.connect(dbConfig); // pool variable stores connections. when a request happens, the API rents a connection out, does it, and then returns it; sql.connect takes dbConfig settings and uses that to connect to the DB
        return pool; // function returns the connections
    } catch (error) {
        console.error('Failed to connect to database:', error); // throws an error so the human knows the function failed
        throw error; // "rethrows" the error so that the function itself knows that it failed
    }
}

module.exports = { connectDB }; // makes the connectDB function usable in other files. Usage: const {connectDB} = require('../db/dbConfig');