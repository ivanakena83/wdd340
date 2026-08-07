import db from './db.js';

const projectSelect = `
    SELECT p.project_id, p.organization_id, p.title, p.description, p.location,
           p.project_date AS date, o.name AS organization_name
    FROM public.project p
    JOIN public.organization o ON o.organization_id = p.organization_id`;

export const addVolunteer = async (projectId, userId) => {
    const result = await db.query(
        `INSERT INTO public.project_volunteer (project_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT (project_id, user_id) DO NOTHING
         RETURNING project_id, user_id`,
        [projectId, userId]
    );
    return result.rows[0] || null;
};

export const removeVolunteer = async (projectId, userId) => {
    const result = await db.query(
        `DELETE FROM public.project_volunteer
         WHERE project_id = $1 AND user_id = $2
         RETURNING project_id, user_id`,
        [projectId, userId]
    );
    return result.rows[0] || null;
};

export const isUserVolunteeringForProject = async (projectId, userId) => {
    const result = await db.query(
        `SELECT 1 FROM public.project_volunteer WHERE project_id = $1 AND user_id = $2 LIMIT 1`,
        [projectId, userId]
    );
    return result.rowCount > 0;
};

export const getVolunteerProjectsByUserId = async (userId) => {
    const result = await db.query(
        `${projectSelect}
         JOIN public.project_volunteer pv ON pv.project_id = p.project_id
         WHERE pv.user_id = $1
         ORDER BY p.project_date, p.title`,
        [userId]
    );
    return result.rows;
};
