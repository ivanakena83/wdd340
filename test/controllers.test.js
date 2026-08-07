import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const requiredFiles = [
  'src/controllers/organizationsController.js',
  'src/controllers/projectsController.js',
  'src/controllers/categoriesController.js'
];

for (const relativePath of requiredFiles) {
  const fullPath = path.join(projectRoot, relativePath);
  assert.ok(fs.existsSync(fullPath), `Missing controller file: ${relativePath}`);
}

const routerSource = fs.readFileSync(path.join(projectRoot, 'src/routes.js'), 'utf8');
assert.match(routerSource, /controllers\/organizationsController\.js/);
assert.match(routerSource, /controllers\/projectsController\.js/);
assert.match(routerSource, /controllers\/categoriesController\.js/);
assert.match(routerSource, /router\.get\('\/register', showRegisterPage\)/);
assert.match(routerSource, /router\.get\('\/login', showLoginPage\)/);
assert.match(routerSource, /router\.get\('\/organizations', showOrganizationsPage\)/);
assert.match(routerSource, /router\.get\('\/projects', showProjectsPage\)/);
assert.match(routerSource, /router\.get\('\/categories', showCategoriesPage\)/);
assert.match(routerSource, /router\.get\('\/organization\/:id', showOrganization\)/);
assert.match(routerSource, /router\.get\('\/project\/:id', showProject\)/);
assert.match(routerSource, /router\.get\('\/category\/:id', showCategory\)/);
assert.match(routerSource, /organizationValidation/);
assert.match(routerSource, /projectValidation/);
assert.match(routerSource, /categoryValidation/);
assert.match(routerSource, /createValidationRedirect/);
assert.match(routerSource, /router\.get\('\/assign-categories\/:id', assignCategories\)/);
assert.match(routerSource, /router\.get\('\/new-organization', requireLogin, requireRole\('admin'\), newOrganization\)/);
assert.match(routerSource, /router\.post\('\/new-organization', requireLogin, requireRole\('admin'\), organizationValidation/);
assert.match(routerSource, /router\.get\('\/new-project', requireLogin, requireRole\('admin'\), newProject\)/);
assert.match(routerSource, /router\.get\('\/new-category', requireLogin, requireRole\('admin'\), newCategory\)/);
assert.match(routerSource, /router\.get\('\/edit-category\/:id', requireLogin, requireRole\('admin'\), editCategory\)/);
assert.match(routerSource, /router\.post\('\/project\/:id\/volunteer', requireLogin, volunteerForProject\)/);
assert.match(routerSource, /router\.post\('\/project\/:id\/volunteer\/remove', requireLogin, removeVolunteerFromProject\)/);

const setupSqlSource = fs.readFileSync(path.join(projectRoot, 'src/setup.sql'), 'utf8');
assert.match(setupSqlSource, /CREATE TABLE public\.role/);
assert.match(setupSqlSource, /CREATE TABLE public\.app_user/);
assert.match(setupSqlSource, /CREATE TABLE public\.project_volunteer/);
assert.match(setupSqlSource, /INSERT INTO public\.role/);

console.log('Controller wiring checks passed.');
