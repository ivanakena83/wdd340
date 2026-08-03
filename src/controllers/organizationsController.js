import * as organizationModel from '../models/organizations.js';
import * as projectModel from '../models/projects.js';

const id = value => Number.parseInt(value, 10);

const requireRecord = (record, res) => {
    if (!record) {
        res.status(404).render('errors/404', { title: 'Not Found' });
        return false;
    }
    return true;
};

export const listOrganizations = async (req, res, next) => {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('organizations', { title: 'Organizations', organizations });
    } catch (error) {
        next(error);
    }
};

export const showOrganization = async (req, res, next) => {
    try {
        const organizationDetails = await organizationModel.getOrganizationById(id(req.params.id));
        if (!requireRecord(organizationDetails, res)) return;

        const projects = await projectModel.getProjectsByOrganizationId(organizationDetails.organization_id);
        res.render('organization', { title: organizationDetails.name, organizationDetails, projects });
    } catch (error) {
        next(error);
    }
};

export const newOrganization = (req, res) => {
    res.render('new-organization', { title: 'New Organization' });
};

export const createOrganization = async (req, res, next) => {
    try {
        await organizationModel.createOrganization(req.body);
        res.redirect('/organizations');
    } catch (error) {
        next(error);
    }
};

export const editOrganization = async (req, res, next) => {
    try {
        const organizationDetails = await organizationModel.getOrganizationById(id(req.params.id));
        if (!requireRecord(organizationDetails, res)) return;

        res.render('edit-organization', { title: 'Edit Organization', organizationDetails });
    } catch (error) {
        next(error);
    }
};

export const updateOrganization = async (req, res, next) => {
    try {
        await organizationModel.updateOrganization(id(req.params.id), req.body);
        res.redirect(`/organization/${req.params.id}`);
    } catch (error) {
        next(error);
    }
};

export const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('organizations', { title: 'Organizations', organizations });
    } catch (error) {
        next(error);
    }
};
