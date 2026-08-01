import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DB_URL || process.env.DATABASE_URL;

// Use DB_URL in local development and DATABASE_URL on Render or other platforms.
export const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

let db = pool;

if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const result = await pool.query(text, params);
                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${Date.now() - start}ms`,
                    rows: result.rowCount
                });
                return result;
            } catch (error) {
                console.error('Error in query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });
                throw error;
            }
        },
        async close() {
            await pool.end();
        }
    };
}

export const testConnection = async () => {
    try {
        if (!connectionString || connectionString.startsWith('PASTE_YOUR_')) {
            throw new Error('DB_URL is not configured. Paste your Render PostgreSQL URL into .env.');
        }
        const result = await db.query('SELECT NOW() AS current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export default db;
