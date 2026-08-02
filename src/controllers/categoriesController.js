import * as categoryModel from '../models/categories.js';

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
    res.render('new-category', { title: 'New Category' });
};

export const createCategory = async (req, res, next) => {
    try {
        await categoryModel.createCategory(req.body.name);
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

export const editCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.getCategoryById(id(req.params.id));
        if (!requireRecord(category, res)) return;

        res.render('edit-category', { title: 'Edit Category', category });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        await categoryModel.updateCategory(id(req.params.id), req.body.name);
        res.redirect(`/category/${req.params.id}`);
    } catch (error) {
        next(error);
    }
};
