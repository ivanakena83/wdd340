const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import models - USING CORRECT PATHS FROM ROOT
const organizationModel = require('./src/models/organization');
const projectModel = require('./src/models/project');
const categoryModel = require('./src/models/categories');
const { testConnection } = require('./src/config/db');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================
// ROUTES
// =============================================

// Home
app.get('/', (req, res) => {
    res.render('index', { title: 'Service Project Directory' });
});

// Organizations
app.get('/organizations', async (req, res) => {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('organizations', { 
            title: 'Organizations',
            organizations: organizations
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Error loading organizations');
    }
});

// Projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await projectModel.getAllProjects();
        res.render('projects', { 
            title: 'Service Projects',
            projects: projects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Error loading projects');
    }
});

// Categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.render('categories', { 
            title: 'Service Categories',
            categories: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error loading categories');
    }
});

// =============================================
// START SERVER
// =============================================

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await testConnection();
});
