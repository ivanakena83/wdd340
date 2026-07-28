const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database
const db = require('./src/db/index');

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Service Project Manager' });
});

app.get('/organizations', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM organizations ORDER BY name');
        res.render('organizations', { 
            title: 'Organizations',
            organizations: result.rows 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err.message);
    }
});

app.get('/projects', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM service_projects ORDER BY name');
        res.render('projects', { 
            title: 'Projects',
            projects: result.rows 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err.message);
    }
});

app.get('/categories', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories ORDER BY name');
        res.render('categories', { 
            title: 'Categories',
            categories: result.rows 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err.message);
    }
});

// Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Change this line
const db = require('./src/db/index');
// To this
const db = require('./db/index');