import { body, validationResult } from 'express-validator';

export const setFlash = (res, type, message) => {
    res.locals.flash = () => ({ [type]: [message] });
};

export const redirectWithFlash = (res, path, type, message) => {
    const separator = path.includes('?') ? '&' : '?';
    const encodedMessage = encodeURIComponent(message);
    return res.redirect(`${path}${separator}${type}=${encodedMessage}`);
};

export const organizationValidation = [
    body('name').trim().notEmpty().withMessage('Organization name is required.').isLength({ min: 3, max: 150 }).withMessage('Organization name must be between 3 and 150 characters.'),
    body('description').trim().notEmpty().withMessage('Description is required.').isLength({ min: 5, max: 500 }).withMessage('Description must be between 5 and 500 characters.'),
    body('contactEmail').trim().notEmpty().withMessage('Contact email is required.').isEmail().withMessage('Contact email must be a valid email address.').isLength({ max: 255 }).withMessage('Contact email must be 255 characters or less.')
];

export const projectValidation = [
    body('title').trim().notEmpty().withMessage('Project title is required.').isLength({ min: 3, max: 200 }).withMessage('Project title must be between 3 and 200 characters.'),
    body('description').trim().notEmpty().withMessage('Project description is required.').isLength({ min: 10, max: 1000 }).withMessage('Project description must be between 10 and 1000 characters.'),
    body('location').trim().notEmpty().withMessage('Location is required.').isLength({ min: 2, max: 200 }).withMessage('Location must be between 2 and 200 characters.'),
    body('date').trim().notEmpty().withMessage('Project date is required.'),
    body('organizationId').trim().notEmpty().withMessage('Please choose an organization.')
];

export const categoryValidation = [
    body('name').trim().notEmpty().withMessage('Category name is required.').isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.')
];

export const categoryAssignmentValidation = [
    body('categoryIds').optional({ values: 'falsy' }).isArray().withMessage('Category assignments must be provided as a list.')
];

export const createValidationRedirect = (redirectPath) => (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array({ onlyFirstError: true })[0];
        const destination = typeof redirectPath === 'function' ? redirectPath(req) : redirectPath;
        return redirectWithFlash(res, destination, 'error', firstError.msg);
    }

    next();
};
