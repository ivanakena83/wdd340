import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tableExists = async (tableName) => {
    const result = await db.query(
        `SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = $1 LIMIT 1`,
        [tableName]
    );
    return result.rowCount > 0;
};

const seedRoles = async () => {
    await db.query(`INSERT INTO public.role (role_name) VALUES ('user'), ('admin') ON CONFLICT (role_name) DO NOTHING`);
};

export const ensureSchema = async () => {
    const coreTables = ['role', 'app_user', 'project_volunteer'];
    const missing = [];

    for (const tableName of coreTables) {
        if (!(await tableExists(tableName))) missing.push(tableName);
    }

    if (missing.length === 0) return;

    const tablesResult = await db.query(
        `SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = 'public'`
    );

    if (missing.length === coreTables.length && Number(tablesResult.rows[0].c) === 0) {
        const sql = await fs.readFile(path.join(__dirname, '..', 'setup.sql'), 'utf8');
        const statements = sql.split(';').map((s) => s.trim()).filter(Boolean);
        for (const statement of statements) {
            if (statement) {
                await db.query(statement);
            }
        }
        console.log('Database initialized with full schema from setup.sql.');
        return;
    }

    if (missing.includes('role')) {
        await db.query(`
            CREATE TABLE IF NOT EXISTS public.role
            (
                role_id SERIAL PRIMARY KEY,
                role_name VARCHAR(50) NOT NULL UNIQUE
            )
        `);
        await seedRoles();
    }

    if (missing.includes('app_user')) {
        await db.query(`
            CREATE TABLE IF NOT EXISTS public.app_user
            (
                user_id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role_id INTEGER NOT NULL DEFAULT 1,
                CONSTRAINT fk_app_user_role
                FOREIGN KEY (role_id)
                REFERENCES public.role (role_id)
                ON UPDATE CASCADE
                ON DELETE RESTRICT
            )
        `);
        await seedRoles();
    }

    if (missing.includes('project_volunteer')) {
        await db.query(`
            CREATE TABLE IF NOT EXISTS public.project_volunteer
            (
                project_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                PRIMARY KEY (project_id, user_id),
                CONSTRAINT fk_project_volunteer_project
                FOREIGN KEY (project_id)
                REFERENCES public.project (project_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
                CONSTRAINT fk_project_volunteer_user
                FOREIGN KEY (user_id)
                REFERENCES public.app_user (user_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
            )
        `);
    }

    console.log('Missing database tables created:', missing.join(', '));
};
