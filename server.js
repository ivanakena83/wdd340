import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes.js';
import { testConnection } from './src/models/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// These values keep the shared header usable until authentication is added.
app.use((req, res, next) => {
    res.locals.user = null;
    res.locals.isLoggedIn = false;

    const flashMessages = {};
    const queryTypes = ['success', 'error'];

    queryTypes.forEach((type) => {
        const value = req.query[type];
        if (typeof value === 'string' && value.trim()) {
            flashMessages[type] = [decodeURIComponent(value)];
        }
    });

    res.locals.flash = Object.keys(flashMessages).length > 0 ? () => flashMessages : null;
    next();
});

app.use(router);

app.use((req, res) => res.status(404).render('errors/404', { title: 'Not Found' }));
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('errors/500', {
        title: 'Server Error',
        error: error.message,
        stack: error.stack,
        NODE_ENV: process.env.NODE_ENV
    });
});

app.listen(PORT, async () => {
    const serverUrl = `http://127.0.0.1:${PORT}`;
    try {
        await testConnection();
        console.log(`Server is running at ${serverUrl}`);
        console.log(`Open this link in your browser: ${serverUrl}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        console.log(`Server is running at ${serverUrl}, but database pages will be unavailable until DB_URL is configured.`);
        console.log(`Open this link in your browser: ${serverUrl}`);
    }
});
