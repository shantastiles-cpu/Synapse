const {connectDB} = require('../db/dbConfig');

async function createSensorData(deviceID_js, motionDetected_js) {
    const pool = connectDB();
    const query_js = `
        INSERT INTO dbo.MotionSensorEntries (DeviceID, MotionDetected, ReadTime)
        VALUES (@deviceID_js, @motionDetected_js, GETDATE())
    `;
    await pool.request()
        .input('deviceID', deviceID_js) // make a SQL parameter called deviceID and give it the value the same as the one stored in the javascript variable called deviceID_js
        .input('motionDetected', motionDetected_js)
        .query(query_js); // use the prepared query statement from query_js to perform the SQL query
}

async function getLatest() {
    const pool = await connectDB();
    const latest = await pool.request(`
        SELECT TOP 1 DeviceID, MotionDetected, ReadTime 
        FROM dbo.MotionSensorEntries 
        WHERE IsDeleted = 0 
        ORDER BY ReadTime DESC
        `);
    return latest.recordset;
}

module.exports = {createSensorData, getLatest};