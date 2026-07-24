const pool = require('../config/db').pool;

async function getAllProjects() {
    try {
        const [rows] = await pool.query(
            `SELECT p.*, o.name AS organization_name 
             FROM projects p
             JOIN organizations o ON p.organization_id = o.id
             ORDER BY p.project_date DESC`
        );
        return rows;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

async function getProjectById(id) {
    try {
        const [rows] = await pool.query(
            `SELECT p.*, o.name AS organization_name 
             FROM projects p
             JOIN organizations o ON p.organization_id = o.id
             WHERE p.id = ?`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error(`Error fetching project ${id}:`, error);
        throw error;
    }
}

module.exports = {
    getAllProjects,
    getProjectById
};