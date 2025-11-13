// Dependencies
const express = require('express');
const sql = require('mssql');
const app = express(); // I dont want to keep typing express
const { connectDB } = require('./db/dbConfig') // Need this for the connection function
const { prune } = require('./services/prune')
app.use(express.json());


// CHANGE THIS TO THE PORT YOU WILL USE
const port = 3000; // 3000 is for local testing

// Activate endpoint logic
const endpointLogic = require('./routes/endpointLogic');
endpointLogic(app);

// Server startup
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

// Call prune service to get rid of entries in the DB older than 5 mins
prune();

