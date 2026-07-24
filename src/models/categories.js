const pool = require('../config/db').pool;

async function getAllCategories() {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, created_at FROM categories ORDER BY name ASC'
        );
        return rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

module.exports = {
    getAllCategories
};