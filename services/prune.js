
const { connectDB } = require('../db/dbConfig')

function prune() {
const pool = connectDB();
setInterval(async () => {
    try {
        const pool = await connectDB();
       await pool.request().query(`
        DELETE FROM dbo.MotionSensorEntries
        WHERE ReadTime < DATEADD(MINUTE, -5, GETDATE())
        AND ReadTime < (
            SELECT MAX(ReadTime) FROM dbo.MotionSensorEntries
        )
        `);
        console.log('Old sensor data purged.');
    } catch (err) {
        console.error('Failed to purge old data:', err);
    }
}, 60000); // 60000 ms = 1 minute
}
module.exports = { prune };