import { findByEmail, createUser, ensureAdminAccount } from '../models/users.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.redirect('/register?error=' + encodeURIComponent('All fields are required.'));
        }

        const existing = await findByEmail(email);
        if (existing) {
            return res.redirect('/register?error=' + encodeURIComponent('An account with that email already exists.'));
        }

        const created = await createUser({ name, email, password });
        // set session
        req.session.user = { name: created.name || name, email: created.email || email, role_name: created.role_name || 'user' };
        req.session.save(() => res.redirect('/dashboard'));
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findByEmail(email);
        if (!user) return res.redirect('/login?error=' + encodeURIComponent('Invalid email or password.'));

        const match = await bcrypt.compare(password, user.password || '');
        if (!match) return res.redirect('/login?error=' + encodeURIComponent('Invalid email or password.'));

        req.session.user = { name: user.name, email: user.email, role_name: user.role_name || 'user' };
        req.session.save(() => res.redirect('/dashboard'));
    } catch (err) {
        next(err);
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/?success=' + encodeURIComponent('You have been logged out.'));
    });
};

export const showDashboard = async (req, res) => {
    const user = req.session && req.session.user;
    res.render('dashboard', {
        title: 'Dashboard',
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role_name || '',
        user,
        volunteerProjects: []
    });
};

export const initAdmin = async () => {
    await ensureAdminAccount();
};
