import express from 'express';

import { showHomePage, showRegisterPage, showLoginPage } from './controllers/index.js';
import { registerUser, loginUser, logoutUser, showDashboard } from './controllers/authController.js';
import { showUsersPage } from './controllers/usersController.js';
import { requireLogin, requireRole } from './middleware/auth.js';
import {
    showOrganizationsPage,
    showOrganization,
    newOrganization,
    createOrganization,
    editOrganization,
    updateOrganization
} from './controllers/organizationsController.js';
import {
    showProjectsPage,
    showProject,
    newProject,
    createProject,
    editProject,
    updateProject,
    assignCategories,
    updateCategoryAssignments
} from './controllers/projectsController.js';
import {
    showCategoriesPage,
    showCategory,
    newCategory,
    createCategory,
    editCategory,
    updateCategory
} from './controllers/categoriesController.js';
import { testErrorPage } from './controllers/errors.js';
import { categoryAssignmentValidation, categoryValidation, createValidationRedirect, organizationValidation, projectValidation } from './controllers/validation.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/register', showRegisterPage);
router.post('/register', registerUser);
router.get('/login', showLoginPage);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

router.get('/dashboard', requireLogin, showDashboard);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganization);
router.get('/new-organization', newOrganization);
router.post('/new-organization', organizationValidation, createValidationRedirect('/new-organization'), createOrganization);
router.get('/edit-organization/:id', editOrganization);
router.post('/edit-organization/:id', organizationValidation, createValidationRedirect(req => `/edit-organization/${req.params.id}`), updateOrganization);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProject);
router.get('/new-project', newProject);
router.post('/new-project', projectValidation, createValidationRedirect('/new-project'), createProject);
router.get('/edit-project/:id', editProject);
router.post('/edit-project/:id', projectValidation, createValidationRedirect(req => `/edit-project/${req.params.id}`), updateProject);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategory);
router.get('/new-category', newCategory);
router.post('/new-category', categoryValidation, createValidationRedirect('/new-category'), createCategory);
router.get('/edit-category/:id', editCategory);
router.post('/edit-category/:id', categoryValidation, createValidationRedirect(req => `/edit-category/${req.params.id}`), updateCategory);
router.get('/assign-categories/:id', assignCategories);
router.post('/assign-categories/:id', categoryAssignmentValidation, createValidationRedirect(req => `/project/${req.params.id}`), updateCategoryAssignments);
router.get('/test-error', testErrorPage);
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);

export default router;
