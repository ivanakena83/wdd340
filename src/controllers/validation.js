export const setFlash = (res, type, message) => {
    res.locals.flash = () => ({ [type]: [message] });
};

export const redirectWithFlash = (res, path, type, message) => {
    const separator = path.includes('?') ? '&' : '?';
    const encodedMessage = encodeURIComponent(message);
    return res.redirect(`${path}${separator}${type}=${encodedMessage}`);
};

export const validateCategoryName = (name) => {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const errors = [];

    if (!trimmedName) {
        errors.push('Category name is required.');
    } else if (trimmedName.length < 3) {
        errors.push('Category name must be at least 3 characters long.');
    }

    if (trimmedName.length > 100) {
        errors.push('Category name must be 100 characters or less.');
    }

    return { trimmedName, errors };
};
