var express = require('express');
var router = express.Router();
const memberModel = require('../models/member.model');
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');

router.get('/register', function (req, res, next) {
  if (req.session.member) {
    return res.redirect('/');
  }
  res.render('register', { layout: false });
})

router.post('/register', async function (req, res, next) {
  try {
    const {name, username, password } = req.body;

    const member = await memberModel.findOne({ username: username, isDeleted: false });
    if (member) {
      throw 'Member already exists';
    }

    await memberModel.create({
      name: name,
      username: username,
      password: await bcrypt.hash(password, 10)
    })


    res.redirect('/login');
  } catch (error) {
    req.session.error = error;
    res.redirect('/register');
  }
})

router.get('/login', function (req, res, next) {
  res.render('login', { layout: false });
});

router.post('/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;

    const member = await memberModel.findOne({ username, isDeleted: false });
    if (!member || !(await bcrypt.compare(password, member.password))) {
      throw 'Invalid username or password';
    }

    req.session.member = member;
    res.redirect('/');
  } catch (error) {
    req.session.error = error;
    res.redirect('/login');
  }
})

router.get('/logout', ensureAuthenticated, function (req, res, next) {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.redirect('/login');
  });
})

module.exports = router;
