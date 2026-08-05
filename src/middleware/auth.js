import { redirectWithFlash } from '../controllers/validation.js';

export const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }

    return redirectWithFlash(res, '/login', 'error', 'You must be signed in to view that page.');
};

export const requireRole = (roleName) => (req, res, next) => {
    const user = req.session && req.session.user;
    if (!user) {
        return redirectWithFlash(res, '/login', 'error', 'You must be signed in to view that page.');
    }

    if (user.role_name && user.role_name.toLowerCase() === roleName.toLowerCase()) {
        return next();
    }

    return redirectWithFlash(res, '/dashboard', 'error', 'You do not have permission to view that page.');
};
