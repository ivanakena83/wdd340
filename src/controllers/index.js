const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

const showRegisterPage = (req, res) => {
    res.render('register', { title: 'Register' });
};

const showLoginPage = (req, res) => {
    res.render('login', { title: 'Login' });
};

export { showHomePage, showRegisterPage, showLoginPage };
export {
    listOrganizations,
    showOrganization,
    newOrganization,
    createOrganization,
    editOrganization,
    updateOrganization
} from './organizations.js';

export {
    listProjects,
    showProject,
    newProject,
    createProject,
    editProject,
    updateProject,
    assignCategories,
    updateCategoryAssignments
} from './projects.js';

export {
    listCategories,
    showCategory,
    newCategory,
    createCategory,
    editCategory,
    updateCategory
} from './categories.js';

export { notFound, handleError } from './errors.js';
