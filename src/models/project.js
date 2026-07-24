const pool = require('../config/db').pool;

const getAllProjects = async () => {
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
};

const getProjectById = async (id) => {
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
};

const getProjectsByOrganizationId = async (organizationId) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.*, o.name AS organization_name 
             FROM projects p
             JOIN organizations o ON p.organization_id = o.id
             WHERE p.organization_id = ?
             ORDER BY p.project_date DESC`,
            [organizationId]
        );
        return rows;
    } catch (error) {
        console.error(`Error fetching projects for organization ${organizationId}:`, error);
        throw error;
    }
};

const getProjectsByCategoryId = async (categoryId) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.*, o.name AS organization_name 
             FROM projects p
             JOIN organizations o ON p.organization_id = o.id
             JOIN project_categories pc ON p.id = pc.project_id
             WHERE pc.category_id = ?
             ORDER BY p.project_date DESC`,
            [categoryId]
        );
        return rows;
    } catch (error) {
        console.error(`Error fetching projects for category ${categoryId}:`, error);
        throw error;
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    getProjectsByOrganizationId,
    getProjectsByCategoryId
};