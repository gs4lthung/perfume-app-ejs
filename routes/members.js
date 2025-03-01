var express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');
const memberModel = require('../models/member.model');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('profile');
});

router.get('/edit', function (req, res, next) {
    res.render('editMember');
});

router.put('/:id', async function (req, res, next) {
    try {
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
