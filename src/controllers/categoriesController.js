import * as categoryModel from '../models/categories.js';
import { redirectWithFlash, setFlash, validateCategoryName } from './validation.js';

const id = value => Number.parseInt(value, 10);

const requireRecord = (record, res) => {
    if (!record) {
        res.status(404).render('errors/404', { title: 'Not Found' });
        return false;
    }
    return true;
};

export const listCategories = async (req, res, next) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (error) {
        next(error);
    }
};

export const showCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.getCategoryById(id(req.params.id));
        if (!requireRecord(category, res)) return;

        const projects = await categoryModel.getProjectsByCategoryId(category.category_id);
        res.render('category', { title: category.name, category, projects });
    } catch (error) {
        next(error);
    }
};

export const newCategory = (req, res) => {
    res.render('new-category', { title: 'New Category', category: {}, errors: [] });
};

export const createCategory = async (req, res, next) => {
    try {
        const { trimmedName, errors } = validateCategoryName(req.body.name);

        if (errors.length > 0) {
            setFlash(res, 'error', errors[0]);
            return res.status(400).render('new-category', {
                title: 'New Category',
                category: { name: trimmedName },
                errors
            });
        }

        await categoryModel.createCategory(trimmedName);
        return redirectWithFlash(res, '/categories', 'success', 'Category created successfully.');
    } catch (error) {
        next(error);
    }
};

export const editCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.getCategoryById(id(req.params.id));
        if (!requireRecord(category, res)) return;

        res.render('edit-category', { title: 'Edit Category', category, errors: [] });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { trimmedName, errors } = validateCategoryName(req.body.name);

        if (errors.length > 0) {
            setFlash(res, 'error', errors[0]);
            return res.status(400).render('edit-category', {
                title: 'Edit Category',
                category: { category_id: id(req.params.id), name: trimmedName },
                errors
            });
        }

        await categoryModel.updateCategory(id(req.params.id), trimmedName);
        return redirectWithFlash(res, `/category/${req.params.id}`, 'success', 'Category updated successfully.');
    } catch (error) {
        next(error);
    }
};

export const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (error) {
        next(error);
    }
};
