const pool = require('../config/db').pool;

const getAllOrganizations = async () => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, description, website, created_at FROM organizations ORDER BY name ASC'
        );
        return rows;
    } catch (error) {
        console.error('Error fetching organizations:', error);
        throw error;
    }
};

const getOrganizationById = async (id) => {
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
};

// Get organization with project count
const getOrganizationWithProjectCount = async (id) => {
    try {
        const [rows] = await pool.query(
            `SELECT o.*, COUNT(p.id) as project_count 
             FROM organizations o
             LEFT JOIN projects p ON o.id = p.organization_id
             WHERE o.id = ?
             GROUP BY o.id`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error(`Error fetching organization with project count ${id}:`, error);
        throw error;
    }
};

module.exports = {
    getAllOrganizations,
    getOrganizationById,
    getOrganizationWithProjectCount
};