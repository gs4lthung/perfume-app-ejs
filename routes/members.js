var express = require('express');
const { ensureAuthenticated, adminAuthenticated } = require('../middlewares/auth.middleware');
const memberModel = require('../models/member.model');
var router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', async function (req, res, next) {
    res.render('profile');
});

router.get('/edit', function (req, res, next) {
    res.render('editMember');
});

router.get('/change-password', function (req, res, next) {
    res.render('changePassword');
});

router.post('/change-password', async function (req, res, next) {
    try {
        const { id, currentPassword, newPassword } = req.body;
        if (req.session.member._id !== id) {
            throw 'You are not allowed to change password of this member';
        }

        const member = await memberModel.findOne({ _id: req.session.member._id, isDeleted: false });
        if (!member) {
            throw 'Member not found';
        }

        if (await bcrypt.compare(currentPassword, member.password) === false) {
            throw 'Old password is incorrect';
        }

        member.password = await bcrypt.hash(newPassword, 10);
        await member.save();

        req.session.destroy();

        res.redirect('/login');

    } catch (error) {
        req.session.error = error;
        res.redirect('/members/change-password');
    }
})

router.put('/:id', adminAuthenticated, async function (req, res, next) {
    try {
        if (req.session.member._id !== req.params.id) {
            throw 'You are not allowed to edit this member';
        }

        const member = await memberModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!member) {
            throw 'Member not found';
        }

        const { name, avatar } = req.body;
        member.name = name;
        member.avatar = avatar;
        await member.save();

        req.session.member = member;
        res.redirect('/members');

    } catch (error) {
        req.session.error = error;
        res.redirect('/members/edit');
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        const member = await memberModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!member) {
            throw 'Member not found';
        }

        member.isDeleted = true;
        await member.save();

        req.session.member = null;
        res.redirect('/login');

    } catch (error) {
        req.session.error = error;
        res.redirect('/members');
    }
})

module.exports = router;
