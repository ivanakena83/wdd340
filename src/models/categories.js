import db, { pool } from './db.js';

export const getAllCategories = async () => (await db.query('SELECT category_id, name FROM public.category ORDER BY name')).rows;

export const getCategoryById = async (categoryId) => {
    const result = await db.query('SELECT category_id, name FROM public.category WHERE category_id = $1', [categoryId]);
    return result.rows[0] || null;
};

export const getCategoriesByProjectId = async (projectId) => (await db.query(
    `SELECT c.category_id, c.name FROM public.category c
     JOIN public.project_category pc ON pc.category_id = c.category_id
     WHERE pc.project_id = $1 ORDER BY c.name`, [projectId]
)).rows;

export const getProjectsByCategoryId = async (categoryId) => (await db.query(
    `SELECT p.project_id, p.organization_id, p.title, p.description, p.location,
            p.project_date AS date, o.name AS organization_name
     FROM public.project p
     JOIN public.organization o ON o.organization_id = p.organization_id
     JOIN public.project_category pc ON pc.project_id = p.project_id
     WHERE pc.category_id = $1 ORDER BY p.project_date`, [categoryId]
)).rows;

export const createCategory = async (name) => (await db.query(
    'INSERT INTO public.category (name) VALUES ($1) RETURNING category_id', [name]
)).rows[0].category_id;

export const updateCategory = async (categoryId, name) => {
    const result = await db.query('UPDATE public.category SET name = $1 WHERE category_id = $2 RETURNING category_id', [name, categoryId]);
    return result.rows[0] || null;
};

export const updateCategoryAssignments = async (projectId, categoryIds) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM public.project_category WHERE project_id = $1', [projectId]);
        for (const categoryId of categoryIds) {
            await client.query('INSERT INTO public.project_category (project_id, category_id) VALUES ($1, $2)', [projectId, categoryId]);
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
