var express = require('express');
var router = express.Router();
const perfumeModel = require('../models/perfume.model');
const commentModel = require('../models/comment.model');
const { adminAuthenticated } = require('../middlewares/auth.middleware');

/* GET perfumes page. */
router.get('/new', function (req, res, next) {
    res.render('newPerfume');
});



router.get('/search', async function (req, res, next) {
    try {
        let query = req.query.query || ''
        if (!query) {
            return res.json([])
        }

        let perfumes = await perfumeModel.find({
            name: {
                $regex: query,
                $options: 'i'
            },
            isDeleted: false
        })
        return res.json(perfumes)
    } catch (error) {

    }
});

router.post('/', adminAuthenticated, async function (req, res, next) {
    try {
        const { name, description, price, brand, volume, targetAudience, incredients, concentration, uri } = req.body

        const perfume = await perfumeModel.create({
            name,
            description,
            price,
            brand,
            volume,
            targetAudience,
            incredients,
            concentration,
            uri
        });
        res.redirect('/');
    } catch (error) {
        console.error("Error creating perfume:", error);
        res.status(500).send("Failed to create perfume");
    }
})

router.get('/:id', async function (req, res, next) {
    try {
        const perfume = await perfumeModel.findById(req.params.id).populate('brand');
        const comments = await perfumeModel.aggregate([
            {
                $match: {
                    _id: perfume._id
                }
            },
            { $unwind: '$comments' },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'comments',
                    foreignField: '_id',
                    as: 'comments'
                }
            },
            {
                $unwind: '$comments'
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'comments.author',
                    foreignField: '_id',
                    as: 'comments.author'
                }
            },
            {
                $unwind: '$comments.author'
            },
            {
                $project: {
                    _id: '$comments._id',
                    content: '$comments.content',
                    rating: '$comments.rating',
                    "authorName": '$comments.author.name',
                    "authorId": '$comments.author._id',
                    "authorAvatar": '$comments.author.avatar',
                }
            }
        ]);
        res.render('perfume', { perfume: perfume, comments: comments });
    } catch (error) {
        req.session.error = error
        res.redirect('/perfumes')

    }
});

router.put('/:id', adminAuthenticated, async function (req, res, next) {
    try {
        const { name, description, price, brand, volume, targetAudience, incredients, concentration, uri } = req.body

        const perfume = await perfumeModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!perfume) {
            throw 'Perfume not found';
        }

        perfume.name = name;
        perfume.description = description;
        perfume.price = price;
        perfume.brand = brand;
        perfume.volume = volume;
        perfume.targetAudience = targetAudience;
        perfume.incredients = incredients;
        perfume.concentration = concentration;
        perfume.uri = uri;

        await perfume.save();
        res.redirect('/perfumes/' + req.params.id);
    } catch (error) {
        req.session.error = error;
        res.redirect('/perfumes');
    }
})

router.delete('/:id', adminAuthenticated, async function (req, res, next) {
    try {
        console.log("Deleting perfume with id:", req.params.id);
        const perfume = await perfumeModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!perfume) {
            throw 'Perfume not found';
        }

        await perfumeModel.updateOne({ _id: req.params.id }, { isDeleted: true });
        res.redirect('/');
    } catch (error) {
        req.session.error = error;
        res.redirect('/perfumes/' + req.params.id);
    }
});



module.exports = router;
