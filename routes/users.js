var express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');
const userModel = require('../models/user.model');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('profile');
});

router.get('/edit', function (req, res, next) {
    res.render('editUser');
});

router.put('/:id', async function (req, res, next) {
    try {
        const user = await userModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!user) {
            throw 'User not found';
        }

        const { name, avatar } = req.body;
        user.name = name;
        user.avatar = avatar;
        await user.save();

        req.session.user = user;
        res.redirect('/users');

    } catch (error) {
        req.session.error = error;
        res.redirect('/users/edit');
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        const user = await userModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!user) {
            throw 'User not found';
        }

        user.isDeleted = true;
        await user.save();

        req.session.user = null;
        res.redirect('/login');

    } catch (error) {
        req.session.error = error;
        res.redirect('/users');
    }
})

module.exports = router;
