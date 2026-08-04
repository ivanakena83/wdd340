import * as organizationModel from '../models/organizations.js';
import * as projectModel from '../models/projects.js';
import * as categoryModel from '../models/categories.js';
import { redirectWithFlash } from './validation.js';

const id = value => Number.parseInt(value, 10);

const requireRecord = (record, res) => {
    if (!record) {
        res.status(404).render('errors/404', { title: 'Not Found' });
        return false;
    }
    return true;
};

export const listProjects = async (req, res, next) => {
    try {
        const projects = await projectModel.getAllProjects();
        res.render('projects', { title: 'Service Projects', projects });
    } catch (error) {
        next(error);
    }
};

export const showProject = async (req, res, next) => {
    try {
        const project = await projectModel.getProjectById(id(req.params.id));
        if (!requireRecord(project, res)) return;

        const categories = await categoryModel.getCategoriesByProjectId(project.project_id);
        res.render('project', { title: project.title, project, categories, isVolunteering: false });
    } catch (error) {
        next(error);
    }
};

export const newProject = async (req, res, next) => {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('new-project', { title: 'New Service Project', organizations });
    } catch (error) {
        next(error);
    }
};

export const createProject = async (req, res, next) => {
    try {
        await projectModel.createProject(req.body);
        return redirectWithFlash(res, '/projects', 'success', 'Project created successfully.');
    } catch (error) {
        next(error);
    }
};

export const editProject = async (req, res, next) => {
    try {
        const project = await projectModel.getProjectById(id(req.params.id));
        if (!requireRecord(project, res)) return;

        const organizations = await organizationModel.getAllOrganizations();
        res.render('edit-project', { title: 'Edit Service Project', project, organizations });
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (req, res, next) => {
    try {
        await projectModel.updateProject(id(req.params.id), req.body);
        return redirectWithFlash(res, `/project/${req.params.id}`, 'success', 'Project updated successfully.');
    } catch (error) {
        next(error);
    }
};

export const assignCategories = async (req, res, next) => {
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
};

export const updateCategoryAssignments = async (req, res, next) => {
    try {
        const categoryIds = ([]).concat(req.body.categoryIds || []).map(id).filter(Number.isInteger);
        await categoryModel.updateCategoryAssignments(id(req.params.id), categoryIds);
        return redirectWithFlash(res, `/project/${req.params.id}`, 'success', 'Category assignments updated successfully.');
    } catch (error) {
        next(error);
    }
};

export const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await projectModel.getAllProjects();
        res.render('projects', { title: 'Service Projects', projects });
    } catch (error) {
        next(error);
    }
};
