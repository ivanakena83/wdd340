import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as organizationModel from './src/models/organizations.js';
import * as projectModel from './src/models/projects.js';
import * as categoryModel from './src/models/categories.js';
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
    res.locals.flash = null;
    next();
});

const id = value => Number.parseInt(value, 10);
const requireRecord = (record, res) => {
    if (!record) {
        res.status(404).render('errors/404', { title: 'Not Found' });
        return false;
    }
    return true;
};

app.get('/', (req, res) => res.render('home', { title: 'Service Project Manager' }));
app.get('/register', (req, res) => res.render('register', { title: 'Register' }));
app.get('/login', (req, res) => res.render('login', { title: 'Login' }));

app.get('/organizations', async (req, res, next) => {
    try { res.render('organizations', { title: 'Organizations', organizations: await organizationModel.getAllOrganizations() }); }
    catch (error) { next(error); }
});

app.get('/organization/:id', async (req, res, next) => {
    try {
        const organizationDetails = await organizationModel.getOrganizationById(id(req.params.id));
        if (!requireRecord(organizationDetails, res)) return;
        const projects = await projectModel.getProjectsByOrganizationId(organizationDetails.organization_id);
        res.render('organization', { title: organizationDetails.name, organizationDetails, projects });
    } catch (error) { next(error); }
});

app.get('/new-organization', (req, res) => res.render('new-organization', { title: 'New Organization' }));
app.post('/new-organization', async (req, res, next) => {
    try { await organizationModel.createOrganization(req.body); res.redirect('/organizations'); }
    catch (error) { next(error); }
});
app.get('/edit-organization/:id', async (req, res, next) => {
    try {
        const organizationDetails = await organizationModel.getOrganizationById(id(req.params.id));
        if (!requireRecord(organizationDetails, res)) return;
        res.render('edit-organization', { title: 'Edit Organization', organizationDetails });
    } catch (error) { next(error); }
});
app.post('/edit-organization/:id', async (req, res, next) => {
    try { await organizationModel.updateOrganization(id(req.params.id), req.body); res.redirect(`/organization/${req.params.id}`); }
    catch (error) { next(error); }
});

app.get('/projects', async (req, res, next) => {
    try { res.render('projects', { title: 'Service Projects', projects: await projectModel.getAllProjects() }); }
    catch (error) { next(error); }
});

app.get('/project/:id', async (req, res, next) => {
    try {
        const project = await projectModel.getProjectById(id(req.params.id));
        if (!requireRecord(project, res)) return;
        const categories = await categoryModel.getCategoriesByProjectId(project.project_id);
        res.render('project', { title: project.title, project, categories, isVolunteering: false });
    } catch (error) { next(error); }
});

app.get('/new-project', async (req, res, next) => {
    try { res.render('new-project', { title: 'New Service Project', organizations: await organizationModel.getAllOrganizations() }); }
    catch (error) { next(error); }
});
app.post('/new-project', async (req, res, next) => {
    try { await projectModel.createProject(req.body); res.redirect('/projects'); }
    catch (error) { next(error); }
});
app.get('/edit-project/:id', async (req, res, next) => {
    try {
        const project = await projectModel.getProjectById(id(req.params.id));
        if (!requireRecord(project, res)) return;
        res.render('edit-project', { title: 'Edit Service Project', project, organizations: await organizationModel.getAllOrganizations() });
    } catch (error) { next(error); }
});
app.post('/edit-project/:id', async (req, res, next) => {
    try { await projectModel.updateProject(id(req.params.id), req.body); res.redirect(`/project/${req.params.id}`); }
    catch (error) { next(error); }
});

app.get('/categories', async (req, res, next) => {
    try { res.render('categories', { title: 'Categories', categories: await categoryModel.getAllCategories() }); }
    catch (error) { next(error); }
});
app.get('/category/:id', async (req, res, next) => {
    try {
        const category = await categoryModel.getCategoryById(id(req.params.id));
        if (!requireRecord(category, res)) return;
        res.render('category', { title: category.name, category, projects: await categoryModel.getProjectsByCategoryId(category.category_id) });
    } catch (error) { next(error); }
});
app.get('/new-category', (req, res) => res.render('new-category', { title: 'New Category' }));
app.post('/new-category', async (req, res, next) => {
    try { await categoryModel.createCategory(req.body.name); res.redirect('/categories'); }
    catch (error) { next(error); }
});
app.get('/edit-category/:id', async (req, res, next) => {
    try {
        const category = await categoryModel.getCategoryById(id(req.params.id));
        if (!requireRecord(category, res)) return;
        res.render('edit-category', { title: 'Edit Category', category });
    } catch (error) { next(error); }
});
app.post('/edit-category/:id', async (req, res, next) => {
    try { await categoryModel.updateCategory(id(req.params.id), req.body.name); res.redirect(`/category/${req.params.id}`); }
    catch (error) { next(error); }
});
app.get('/assign-categories/:id', async (req, res, next) => {
    try {
        const projectDetails = await projectModel.getProjectById(id(req.params.id));
        if (!requireRecord(projectDetails, res)) return;
        res.render('assign-categories', { title: 'Assign Categories', projectDetails, projectId: projectDetails.project_id, categories: await categoryModel.getAllCategories(), assignedCategories: await categoryModel.getCategoriesByProjectId(projectDetails.project_id) });
    } catch (error) { next(error); }
});
app.post('/assign-categories/:id', async (req, res, next) => {
    try {
        const categoryIds = ([]).concat(req.body.categoryIds || []).map(id).filter(Number.isInteger);
        await categoryModel.updateCategoryAssignments(id(req.params.id), categoryIds);
        res.redirect(`/project/${req.params.id}`);
    } catch (error) { next(error); }
});

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
