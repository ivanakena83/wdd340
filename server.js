const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const organizationModel = require('./src/models/organizations');
const projectModel = require('./src/models/projects');
const categoryModel = require('./src/models/categories');
const { testConnection } = require('./src/config/db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        res.status(500).send('Error loading categories');
    }
});

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await testConnection();
});