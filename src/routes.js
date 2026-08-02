import express from 'express';

import { showHomePage, showRegisterPage, showLoginPage } from './controllers/index.js';
import {
    showOrganizationsPage,
    listOrganizations,
    showOrganization,
    newOrganization,
    createOrganization,
    editOrganization,
    updateOrganization
} from './controllers/organizations.js';
import {
    showProjectsPage,
    listProjects,
    showProject,
    newProject,
    createProject,
    editProject,
    updateProject,
    assignCategories,
    updateCategoryAssignments
} from './controllers/projects.js';
import {
    showCategoriesPage,
    listCategories,
    showCategory,
    newCategory,
    createCategory,
    editCategory,
    updateCategory
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/register', showRegisterPage);
router.get('/login', showLoginPage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganization);
router.get('/new-organization', newOrganization);
router.post('/new-organization', createOrganization);
router.get('/edit-organization/:id', editOrganization);
router.post('/edit-organization/:id', updateOrganization);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProject);
router.get('/new-project', newProject);
router.post('/new-project', createProject);
router.get('/edit-project/:id', editProject);
router.post('/edit-project/:id', updateProject);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategory);
router.get('/new-category', newCategory);
router.post('/new-category', createCategory);
router.get('/edit-category/:id', editCategory);
router.post('/edit-category/:id', updateCategory);
router.get('/assign-categories/:id', assignCategories);
router.post('/assign-categories/:id', updateCategoryAssignments);
router.get('/test-error', testErrorPage);

export default router;
