var express = require('express');
var router = express.Router();
const categoryModel = require('../models/brand.model');
const perfumeModel = require('../models/perfume.model');
const { default: mongoose } = require('mongoose');

/* GET perfumes page. */
router.get('/', async function (req, res, next) {
    const pefumes = await perfumeModel.find().populate('category');
    req.session.perfumes = pefumes

    const categories = await categoryModel.find();
    req.session.categories = categories
    res.render('perfumes');
});

router.post('/', async function (req, res, next) {
    try {
        const { name, category, description, price, brand, fragranceType, volume, imageUrl } = req.body

        const perfume = await perfumeModel.create({
            name,
            category,
            description,
            price,
            brand,
            fragranceType,
            volume,
            imageUrl
        });
        res.redirect('/perfumes/new');
    } catch (error) {
        console.error("Error creating perfume:", error);
        res.status(500).send("Failed to create perfume");
    }

})

router.get('/new', function (req, res, next) {
    res.render('newPerfume');
});

module.exports = router;
