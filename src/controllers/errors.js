const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export const notFound = (req, res) => {
    res.status(404).render('errors/404', { title: 'Not Found' });
};

export const handleError = (error, req, res, next) => {
    console.error(error);
    res.status(500).render('errors/500', {
        title: 'Server Error',
        error: error.message,
        stack: error.stack,
        NODE_ENV: process.env.NODE_ENV
    });
};

export { testErrorPage };
