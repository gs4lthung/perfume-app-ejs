var express = require('express');
const brandModel = require('../models/brand.model');
var router = express.Router();

router.get('/', async function (req, res, next) {
    const brands = await brandModel.find({ isDeleted: false });
    res.render('brand', { brands: brands });
});

router.post('/', async function (req, res, next) {
    try {
        const { name } = req.body;
        const brand = await brandModel.create({ name });
        if (!brand) {
            throw 'Brand not created';
        }
        res.redirect('/brands');

    } catch (error) {
        req.session.error = error;
        res.redirect('/brands');
    }
})

router.put('/:id', async function (req, res, next) {
    try {
        const { name } = req.body;
        const brand = await brandModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!brand) {
            throw 'Brand not found';
        }
        brand.name = name;
        await brand.save();
        res.redirect('/brands');
    } catch (error) {
        req.session.error = error;
        res.redirect('/brands');
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        const brand = await brandModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!brand) {
            throw 'Brand not found';
        }
        brand.isDeleted = true;
        await brand.save();
        res.redirect('/brands');
    } catch (error) {
        req.session.error = error;
        res.redirect('/brands');
    }
})

module.exports = router;