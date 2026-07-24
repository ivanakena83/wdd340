const pool = require('../config/db').pool;

async function getAllOrganizations() {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, description, website, created_at FROM organizations ORDER BY name ASC'
        );
        return rows;
    } catch (error) {
        console.error('Error fetching organizations:', error);
        throw error;
    }
}

async function getOrganizationById(id) {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, description, website, created_at FROM organizations WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error(`Error fetching organization ${id}:`, error);
        throw error;
    }
}

module.exports = {
    getAllOrganizations,
    getOrganizationById
};