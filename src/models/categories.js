const pool = require('../config/db').pool;

const getAllCategories = async () => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, created_at FROM categories ORDER BY name ASC'
        );
        return rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const getCategoryById = async (id) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, created_at FROM categories WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error(`Error fetching category ${id}:`, error);
        throw error;
    }
};

const getCategoriesByProjectId = async (projectId) => {
    try {
        const [rows] = await pool.query(
            `SELECT c.id, c.name 
             FROM categories c
             JOIN project_categories pc ON c.id = pc.category_id
             WHERE pc.project_id = ?
             ORDER BY c.name ASC`,
            [projectId]
        );
        return rows;
    } catch (error) {
        console.error(`Error fetching categories for project ${projectId}:`, error);
        throw error;
    }
};

// Get category with project count
const getCategoryWithProjectCount = async (id) => {
    try {
        const [rows] = await pool.query(
            `SELECT c.*, COUNT(pc.project_id) as project_count 
             FROM categories c
             LEFT JOIN project_categories pc ON c.id = pc.category_id
             WHERE c.id = ?
             GROUP BY c.id`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error(`Error fetching category with project count ${id}:`, error);
        throw error;
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getCategoryWithProjectCount
};