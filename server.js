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

// Organizations - with error handling
app.get('/organizations', async (req, res) => {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('organizations', { 
            title: 'Organizations',
            organizations: organizations
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Error loading organizations. Please try again later.'
        });
    }
});

// Individual Organization - with projects
app.get('/organizations/:id', async (req, res) => {
    try {
        const organization = await organizationModel.getOrganizationById(req.params.id);
        if (!organization) {
            return res.status(404).render('error', { 
                title: 'Not Found',
                message: 'Organization not found'
            });
        }
        const projects = await projectModel.getProjectsByOrganizationId(req.params.id);
        res.render('organization-detail', { 
            title: organization.name,
            organization: organization,
            projects: projects
        });
    } catch (error) {
        console.error('Error fetching organization details:', error);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Error loading organization details. Please try again later.'
        });
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
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Error loading projects. Please try again later.'
        });
    }
});

// Individual Project
app.get('/projects/:id', async (req, res) => {
    try {
        const project = await projectModel.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).render('error', { 
                title: 'Not Found',
                message: 'Project not found'
            });
        }
        const categories = await categoryModel.getCategoriesByProjectId(req.params.id);
        res.render('project-detail', { 
            title: project.title,
            project: project,
            categories: categories
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Error loading project details. Please try again later.'
        });
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
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Error loading categories. Please try again later.'
        });
    }
});

// Individual Category with projects
app.get('/categories/:id', async (req, res) => {
    try {
        const category = await categoryModel.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).render('error', { 
                title: 'Not Found',
                message: 'Category not found'
            });
        }
        const projects = await projectModel.getProjectsByCategoryId(req.params.id);
        res.render('category-detail', { 
            title: category.name,
            category: category,
            projects: projects
        });
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Error loading category details. Please try again later.'
        });
    }
});

// =============================================
// START SERVER
// =============================================

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await testConnection();
});