import express from 'express';
import * as organizationModel from './models/organizations.js';
import * as projectModel from './models/projects.js';
import * as categoryModel from './models/categories.js';

const router = express.Router();

const id = value => Number.parseInt(value, 10);
const requireRecord = (record, res) => {
    if (!record) {
        res.status(404).render('errors/404', { title: 'Not Found' });
        return false;
    }
    return true;
};

router.get('/', (req, res) => res.render('home', { title: 'Service Project Manager' }));
router.get('/register', (req, res) => res.render('register', { title: 'Register' }));
router.get('/login', (req, res) => res.render('login', { title: 'Login' }));

router.get('/organizations', async (req, res, next) => {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('organizations', { title: 'Organizations', organizations });
    } catch (error) {
        next(error);
    }
});

router.get('/organization/:id', async (req, res, next) => {
    try {
        const organizationDetails = await organizationModel.getOrganizationById(id(req.params.id));
        if (!requireRecord(organizationDetails, res)) return;
        const projects = await projectModel.getProjectsByOrganizationId(organizationDetails.organization_id);
        res.render('organization', { title: organizationDetails.name, organizationDetails, projects });
    } catch (error) {
        next(error);
    }
});

router.get('/new-organization', (req, res) => res.render('new-organization', { title: 'New Organization' }));
router.post('/new-organization', async (req, res, next) => {
    try {
        await organizationModel.createOrganization(req.body);
        res.redirect('/organizations');
    } catch (error) {
        next(error);
    }
});

router.get('/edit-organization/:id', async (req, res, next) => {
    try {
        const organizationDetails = await organizationModel.getOrganizationById(id(req.params.id));
        if (!requireRecord(organizationDetails, res)) return;
        res.render('edit-organization', { title: 'Edit Organization', organizationDetails });
    } catch (error) {
        next(error);
    }
});

router.post('/edit-organization/:id', async (req, res, next) => {
    try {
        await organizationModel.updateOrganization(id(req.params.id), req.body);
        res.redirect(`/organization/${req.params.id}`);
    } catch (error) {
        next(error);
    }
});

router.get('/projects', async (req, res, next) => {
    try {
        const projects = await projectModel.getAllProjects();
        res.render('projects', { title: 'Service Projects', projects });
    } catch (error) {
        next(error);
    }
});

router.get('/project/:id', async (req, res, next) => {
    try {
        const project = await projectModel.getProjectById(id(req.params.id));
        if (!requireRecord(project, res)) return;
        const categories = await categoryModel.getCategoriesByProjectId(project.project_id);
        res.render('project', { title: project.title, project, categories, isVolunteering: false });
    } catch (error) {
        next(error);
    }
});

router.get('/new-project', async (req, res, next) => {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('new-project', { title: 'New Service Project', organizations });
    } catch (error) {
        next(error);
    }
});

router.post('/new-project', async (req, res, next) => {
    try {
        await projectModel.createProject(req.body);
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
});

router.get('/edit-project/:id', async (req, res, next) => {
    try {
        const project = await projectModel.getProjectById(id(req.params.id));
        if (!requireRecord(project, res)) return;
        const organizations = await organizationModel.getAllOrganizations();
        res.render('edit-project', { title: 'Edit Service Project', project, organizations });
    } catch (error) {
        next(error);
    }
});

router.post('/edit-project/:id', async (req, res, next) => {
    try {
        await projectModel.updateProject(id(req.params.id), req.body);
        res.redirect(`/project/${req.params.id}`);
    } catch (error) {
        next(error);
    }
});

router.get('/categories', async (req, res, next) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (error) {
        next(error);
    }
});

router.get('/category/:id', async (req, res, next) => {
    try {
        const category = await categoryModel.getCategoryById(id(req.params.id));
        if (!requireRecord(category, res)) return;
        const projects = await categoryModel.getProjectsByCategoryId(category.category_id);
        res.render('category', { title: category.name, category, projects });
    } catch (error) {
        next(error);
    }
});

router.get('/new-category', (req, res) => res.render('new-category', { title: 'New Category' }));
router.post('/new-category', async (req, res, next) => {
    try {
        await categoryModel.createCategory(req.body.name);
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
});

router.get('/edit-category/:id', async (req, res, next) => {
    try {
        const category = await categoryModel.getCategoryById(id(req.params.id));
        if (!requireRecord(category, res)) return;
        res.render('edit-category', { title: 'Edit Category', category });
    } catch (error) {
        next(error);
    }
});

router.post('/edit-category/:id', async (req, res, next) => {
    try {
        await categoryModel.updateCategory(id(req.params.id), req.body.name);
        res.redirect(`/category/${req.params.id}`);
    } catch (error) {
        next(error);
    }
});

router.get('/assign-categories/:id', async (req, res, next) => {
    try {
        const projectDetails = await projectModel.getProjectById(id(req.params.id));
        if (!requireRecord(projectDetails, res)) return;

        const categories = await categoryModel.getAllCategories();
        const assignedCategories = await categoryModel.getCategoriesByProjectId(projectDetails.project_id);

        res.render('assign-categories', {
            title: 'Assign Categories',
            projectDetails,
            projectId: projectDetails.project_id,
            categories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
});

router.post('/assign-categories/:id', async (req, res, next) => {
    try {
        const categoryIds = ([]).concat(req.body.categoryIds || []).map(id).filter(Number.isInteger);
        await categoryModel.updateCategoryAssignments(id(req.params.id), categoryIds);
        res.redirect(`/project/${req.params.id}`);
    } catch (error) {
        next(error);
    }
});

export default router;
