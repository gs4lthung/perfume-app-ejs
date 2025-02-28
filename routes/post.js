var express = require('express');
var router = express.Router();
const postModel = require('../models/post.model');

router.get('/', async function (req, res, next) {
    const posts = await postModel.find().populate('author');
    res.render('posts', { posts });
})

router.post('/', async function (req, res, next) {
    try {
        const { title, content } = req.body;

        await postModel.create({
            title,
            content,
            author: req.session.user._id
        })

        res.redirect('/posts');
    } catch (error) {
        console.log(error);
        res.send('An error occurred');
    }
})

module.exports = router;