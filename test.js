// testdb.js

// Import required modules
import db from './config/dbConfig.js';

(async () => {
    try {
        // Attempt a simple connection test
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM users WHERE username = "john_doe"',
        );
        console.log(rows[0].count > 0);
        console.log('Database connected successfully!');
        console.log('Test Query Result:', rows);
    } catch (err) {
        console.error('Database connection failed:', err.message);
    } finally {
        // Close the database pool
        await db.end();
        console.log('Database connection closed.');
    }
})();
