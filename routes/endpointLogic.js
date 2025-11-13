const { connectDB } = require("../db/dbConfig");
const sql = require('mssql');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

function endpointLogic(app) { // Making a function called endpointLogic
// API - Sensor - Database
app.post('/api/sensor', async (req, res) => {
    try {
        const { deviceID, motionDetected } = req.body; // For JSON body parser extraction
        
        const pool = await connectDB();
        await pool.request()
            .input('deviceID_js', sql.Int, deviceID) // Specifying SQL datatype just in case 
            .input('motionDetected_js', sql.Bit, motionDetected)
            .query(`
                INSERT INTO dbo.MotionSensorEntries (DeviceID, MotionDetected, ReadTime)
                VALUES (@deviceID_js, @motionDetected_js, GETDATE())
            `); // Adding IsDeleted parameter so that a proper reading ensures it cannot be mistaken for a ghost inpu
        
        res.status(200).json({ message: 'Entry inserted successfully' }); // 200 is a server response that says "okay"

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Entry failed' }); // 500 is a server response that is an internal server error
    }
});

// API - Frontend (GET)
app.get('/api/sensor/latest', async(req, res) => { // dont need JSON body parser as we will not be receiving JSONs from this endpoint. Additionally, req isnt called because the API doesnt need anything from the frontend
    console.log('HIT /api/sensor/latest at', new Date().toISOString()); // debugging for Flutter
    try {
        const pool = await connectDB(); // Connect to the DB
        const result = await pool.request() // Make a SQL request with the following query
            .query(`
                WITH LatestReadings AS (
                SELECT 
                    e.DeviceID,
                    e.MotionDetected,
                    e.ReadTime,
                    d.IsDeleted,
                    ROW_NUMBER() OVER (PARTITION BY e.DeviceID ORDER BY e.ReadTime DESC) AS rn
                FROM dbo.MotionSensorEntries AS e
                JOIN dbo.SensorDevice AS d
                    ON e.DeviceID = d.DeviceID
                WHERE d.IsDeleted = 0
                )
                SELECT
                    DeviceID,
                    MotionDetected,
                    ReadTime
                FROM LatestReadings
                WHERE rn = 1
                ORDER BY DeviceID;
                `)

        if (result.recordset.length === 0) { // empty data handling
            return res.status(404).json({ message: 'Entry not found'})
        }

        res.status(200).json(result.recordset); // record to be sent as a JSON 
    }
    catch (err) { // error handling
        console.error('Error fetching latest data', err);
        res.status(500).json({ message: 'Failed to fetch latest sensor data' });
    }
});

app.post('/api/sensor/register', async (req, res) => { // Registering a device for identification and mapping
    try {
        const {deviceID} = req.body;
        const pool = await connectDB();
        await pool.request()
            .input('DeviceID', sql.Int, deviceID)
            .query(`
               INSERT INTO dbo.SensorDevice (CreatedDate)
               VALUES (GETDATE())
            `);
        res.status(200).json({ message: "Device registered successfully" });
    }
    catch (err) {
        console.error('Device registration failed', err);
        res.status(500).json({ message: 'Failed to register device' });
    }
});
}

module.exports = endpointLogic;