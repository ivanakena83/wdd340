import db from './db.js';

const projectSelect = `
    SELECT p.project_id, p.organization_id, p.title, p.description, p.location,
           p.project_date AS date, o.name AS organization_name
    FROM public.project p
    JOIN public.organization o ON o.organization_id = p.organization_id`;

export const getAllProjects = async () => {
    const result = await db.query(`${projectSelect} ORDER BY p.project_date, p.title`);
    return result.rows;
};

export const getProjectById = async (projectId) => {
    const result = await db.query(`${projectSelect} WHERE p.project_id = $1`, [projectId]);
    return result.rows[0] || null;
};

export const getProjectsByOrganizationId = async (organizationId) => (
    await db.query(`${projectSelect} WHERE p.organization_id = $1 ORDER BY p.project_date`, [organizationId])
).rows;

export const createProject = async ({ title, description, location, date, organizationId }) => (
    await db.query(
        `INSERT INTO public.project (organization_id, title, description, location, project_date)
         VALUES ($1, $2, $3, $4, $5) RETURNING project_id`,
        [organizationId, title, description, location, date]
    )
).rows[0].project_id;

export const updateProject = async (projectId, { title, description, location, date, organizationId }) => {
    const result = await db.query(
        `UPDATE public.project
         SET organization_id = $1, title = $2, description = $3, location = $4, project_date = $5
         WHERE project_id = $6 RETURNING project_id`,
        [organizationId, title, description, location, date, projectId]
    );
    return result.rows[0] || null;
};
