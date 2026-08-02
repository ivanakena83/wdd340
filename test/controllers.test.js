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
assert.match(routerSource, /controllers\/organizations\.js/);
assert.match(routerSource, /controllers\/projects\.js/);
assert.match(routerSource, /controllers\/categories\.js/);
assert.match(routerSource, /router\.get\('\/register', showRegisterPage\)/);
assert.match(routerSource, /router\.get\('\/login', showLoginPage\)/);
assert.match(routerSource, /router\.get\('\/organizations', showOrganizationsPage\)/);
assert.match(routerSource, /router\.get\('\/projects', showProjectsPage\)/);
assert.match(routerSource, /router\.get\('\/categories', showCategoriesPage\)/);
assert.match(routerSource, /router\.get\('\/organization\/:id', showOrganization\)/);
assert.match(routerSource, /router\.get\('\/project\/:id', showProject\)/);
assert.match(routerSource, /router\.get\('\/category\/:id', showCategory\)/);
assert.match(routerSource, /router\.post\('\/new-organization', createOrganization\)/);
assert.match(routerSource, /router\.post\('\/new-project', createProject\)/);
assert.match(routerSource, /router\.post\('\/new-category', createCategory\)/);
assert.match(routerSource, /router\.get\('\/assign-categories\/:id', assignCategories\)/);

console.log('Controller wiring checks passed.');
