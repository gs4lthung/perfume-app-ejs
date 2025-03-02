var express = require('express');
var router = express.Router();
const commentModel = require('../models/comment.model');
const perfumeModel = require('../models/perfume.model');


router.post('/', async function (req, res, next) {
    try {
        const { content, rating, perfumeId, memberId } = req.body;
        if (!content || !rating || !perfumeId || !memberId) {
            throw 'Cannot comment on this perfume';
        }

        const perfumeHolders = await perfumeModel.findOne({ _id: perfumeId, isDeleted: false }).populate('comments')
        for (let comment of perfumeHolders.comments) {
            if (comment.author.toString() == memberId) {
                throw 'You have already commented on this perfume'
            }
        }

        const comment = await commentModel.create({
            content: content,
            rating: rating,
            author: memberId,
        })

        await perfumeModel.findByIdAndUpdate
            (perfumeId, { $push: { comments: comment._id } });

        res.redirect(`/perfumes/${perfumeId}`);
    } catch (error) {
        req.session.error = error;
        res.redirect('/perfumes/' + req.body.perfumeId);
    }
});

module.exports = router;