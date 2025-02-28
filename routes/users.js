var express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');
const userModel = require('../models/user.model');
var router = express.Router();

router.get('/', ensureAuthenticated, function (req, res, next) {
    res.render('profile');
});

router.delete('/:id', ensureAuthenticated, async function (req, res, next) {
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
