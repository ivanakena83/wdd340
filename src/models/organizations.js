import db from './db.js';

export const getAllOrganizations = async () => {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        ORDER BY name;
    `);
    return result.rows;
};

export const getOrganizationById = async (organizationId) => {
    const result = await db.query(
        `SELECT organization_id, name, description, contact_email, logo_filename
         FROM public.organization
         WHERE organization_id = $1`,
        [organizationId]
    );
    return result.rows[0] || null;
};

export const createOrganization = async ({ name, description, contactEmail, logoFilename }) => {
    const result = await db.query(
        `INSERT INTO public.organization (name, description, contact_email, logo_filename)
         VALUES ($1, $2, $3, $4) RETURNING organization_id`,
        [name, description, contactEmail, logoFilename || 'placeholder-logo.png']
    );
    return result.rows[0].organization_id;
};

export const updateOrganization = async (organizationId, { name, description, contactEmail, logoFilename }) => {
    const result = await db.query(
        `UPDATE public.organization
         SET name = $1, description = $2, contact_email = $3, logo_filename = $4
         WHERE organization_id = $5 RETURNING organization_id`,
        [name, description, contactEmail, logoFilename, organizationId]
    );
    return result.rows[0] || null;
};
