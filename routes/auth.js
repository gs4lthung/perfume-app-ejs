var express = require('express');
var router = express.Router();
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');

router.get('/register', function (req, res, next) {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('register', { layout: false });
})

router.post('/register', async function (req, res, next) {
  try {
    const { name, username, password } = req.body;

    const user = await userModel.findOne({ userName: username });
    if (user) {
      throw 'User already exists';
    }

    await userModel.create({
      name: name,
      userName: username,
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

    const user = await userModel.findOne({ userName: username, isDeleted: false });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw 'Invalid username or password'; 
    }

    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    req.session.error=error;
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
