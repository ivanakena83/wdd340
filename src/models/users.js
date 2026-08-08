import db from './db.js';
import bcrypt from 'bcrypt';

const sanitizeUser = (user) => {
    if (!user) return null;
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    return sanitizedUser;
};

const getRoleNameById = async (role_id) => {
    if (role_id == null) return null;
    try {
        const result = await db.query('SELECT role_name FROM public.role WHERE role_id = $1 LIMIT 1', [role_id]);
        return result.rowCount > 0 ? result.rows[0].role_name : null;
    } catch {
        return null;
    }
};

const getRoleIdByName = async (roleName) => {
    try {
        const result = await db.query('SELECT role_id FROM public.role WHERE role_name = $1 LIMIT 1', [roleName]);
        return result.rowCount > 0 ? result.rows[0].role_id : null;
    } catch {
        return null;
    }
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
            q: `SELECT user_id, name, email, password, role_id FROM public.app_user WHERE email = $1 LIMIT 1`,
            params: [email],
            transform: async (row) => {
                if (!row) return row;
                const roleName = await getRoleNameById(row.role_id);
                return { ...row, role_name: roleName || undefined };
            }
        },
        {
            q: `SELECT user_id, name, email, password, role_name FROM public.users WHERE email = $1 LIMIT 1`,
            params: [email]
        }
    ];

    for (const query of queries) {
        try {
            const result = await db.query(query.q, query.params);
            if (result.rowCount > 0) {
                return query.transform ? await query.transform(result.rows[0]) : result.rows[0];
            }
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
        `SELECT user_id, name, email, role_id FROM public.app_user ORDER BY name;`,
        `SELECT user_id, name, email, role_name FROM public.users ORDER BY name;`,
        `SELECT user_id, name, email, role_name FROM public."user" ORDER BY name;`
    ];

    for (const q of queries) {
        try {
            const result = await db.query(q);
            const rows = result.rows;
            if (rows.length === 0) return [];

            if ('role_id' in rows[0] && !('role_name' in rows[0])) {
                const roleIds = [...new Set(rows.map((row) => row.role_id).filter((id) => id != null))];
                const roleNames = {};
                await Promise.all(roleIds.map(async (roleId) => {
                    const name = await getRoleNameById(roleId);
                    if (name) roleNames[roleId] = name;
                }));
                return rows.map((row) => sanitizeUser({
                    ...row,
                    role_name: row.role_id != null ? roleNames[row.role_id] || 'user' : 'user'
                }));
            }

            return rows.map(sanitizeUser);
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
    const queries = [];

    if (role_id != null) {
        queries.push({
            q: `INSERT INTO public.app_user (name, email, password, role_id) VALUES ($1, $2, $3, $4)
                RETURNING user_id, name, email, role_id`,
            params: [name, email, hash, role_id]
        });
    }

    queries.push({
        q: `INSERT INTO public.app_user (name, email, password) VALUES ($1, $2, $3)
            RETURNING user_id, name, email, role_id`,
        params: [name, email, hash]
    });

    queries.push({
        q: `INSERT INTO public.users (name, email, password, role_name) VALUES ($1, $2, $3, $4)
            RETURNING user_id, name, email, role_name`,
        params: [name, email, hash, role_name || 'user']
    });

    for (const query of queries) {
        try {
            const result = await db.query(query.q, query.params);
            if (result.rowCount > 0) {
                const user = result.rows[0];
                if ('role_id' in user && user.role_id != null) {
                    user.role_name = await getRoleNameById(user.role_id) || 'user';
                }
                return sanitizeUser(user);
            }
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

        const adminRoleId = await getRoleIdByName('admin');
        const created = await createUser({
            name: 'Admin',
            email,
            password,
            role_id: adminRoleId ?? undefined,
            role_name: 'admin'
        });
        return created;
    } catch (err) {
        console.error('ensureAdminAccount error:', err.message);
        return null;
    }
};
