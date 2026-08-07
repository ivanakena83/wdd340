import db from './db.js';
import bcrypt from 'bcrypt';

const sanitizeUser = (user) => {
    if (!user) return null;
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    return sanitizedUser;
};

const getUserByEmailRaw = async (email) => {
    const queries = [
        {
            q: `SELECT u.user_id, u.name, u.email, u.password, r.role_name
                FROM public.app_user u
                LEFT JOIN public.role r ON u.role_id = r.role_id
                WHERE u.email = $1 LIMIT 1`,
            params: [email]
        },
        {
            q: `SELECT user_id, name, email, password, role_name FROM public.app_user WHERE email = $1 LIMIT 1`,
            params: [email]
        },
        {
            q: `SELECT user_id, name, email, password, role_name FROM public.users WHERE email = $1 LIMIT 1`,
            params: [email]
        }
    ];

    for (const { q, params } of queries) {
        try {
            const result = await db.query(q, params);
            if (result.rowCount > 0) return result.rows[0];
        } catch (err) {
            // ignore and try next compatible query
        }
    }

    return null;
};

export const getAllUsers = async () => {
    const queries = [
        `SELECT u.user_id, u.name, u.email, r.role_name
         FROM public.app_user u
         LEFT JOIN public.role r ON u.role_id = r.role_id
         ORDER BY u.name;`,
        `SELECT user_id, name, email, role_name FROM public.app_user ORDER BY name;`,
        `SELECT user_id, name, email, role_name FROM public.users ORDER BY name;`,
        `SELECT user_id, name, email, role_name FROM public."user" ORDER BY name;`
    ];

    for (const q of queries) {
        try {
            const result = await db.query(q);
            return result.rows.map(sanitizeUser);
        } catch (err) {
            // try next query
        }
    }

    return [];
};

export const findByEmail = async (email) => {
    const user = await getUserByEmailRaw(email);
    return sanitizeUser(user);
};

export const verifyPassword = async (password, hashedPassword) => {
    if (!password || !hashedPassword) return false;
    return bcrypt.compare(password, hashedPassword);
};

export const authenticateUser = async (email, password) => {
    const user = await getUserByEmailRaw(email);
    if (!user) return null;

    const isMatch = await verifyPassword(password, user.password || '');
    if (!isMatch) return null;

    return sanitizeUser(user);
};

export const createUser = async ({ name, email, password, role_id = null, role_name = null }) => {
    const hash = await bcrypt.hash(password, 10);
    const queries = [
        { q: `INSERT INTO public.app_user (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email`, params: [name, email, hash, role_id] },
        { q: `INSERT INTO public.app_user (name, email, password) VALUES ($1, $2, $3) RETURNING user_id, name, email`, params: [name, email, hash] },
        { q: `INSERT INTO public.users (name, email, password, role_name) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role_name`, params: [name, email, hash, role_name] }
    ];

    for (const { q, params } of queries) {
        try {
            const result = await db.query(q, params);
            if (result.rowCount > 0) return sanitizeUser(result.rows[0]);
        } catch (err) {
            // try next
        }
    }

    throw new Error('Unable to create user: no compatible users table found.');
};

export const ensureAdminAccount = async (email = 'admin@example.com', password = 'cse340!') => {
    try {
        const existing = await findByEmail(email);
        if (existing) return existing;

        const created = await createUser({ name: 'Admin', email, password, role_id: 1, role_name: 'admin' });
        return created;
    } catch (err) {
        console.error('ensureAdminAccount error:', err.message);
        return null;
    }
};
