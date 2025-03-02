var express = require('express');
const perfumeModel = require('../models/perfume.model');
const brandModel = require('../models/brand.model');
const memberModel = require('../models/member.model');
const { adminAuthenticated } = require('../middlewares/auth.middleware');
var router = express.Router();

router.get('/collectors', adminAuthenticated, async function (req, res, next) {
  const members = await memberModel.find({ isDeleted: false });
  res.render('collectors', { members: members });
})

router.get('/', async function (req, res, next) {
  const pefumes = await perfumeModel.find({ isDeleted: false }).populate('brand');
  req.session.perfumes = pefumes

  const brands = await brandModel.find({ isDeleted: false });
  req.session.brands = brands
  res.render('index', { perfumes: pefumes, brands: brands });
});

router.get('/about', function (req, res, next) {
  res.render('about');
});

router.get('/contact', function (req, res, next) {
  res.render('contact');
})

module.exports = router;
