import { getAllUsers } from '../models/users.js';

export const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.render('users', { title: 'Registered Users', users, user: req.session.user });
    } catch (err) {
        next(err);
    }
};
