const mongoose = require('mongoose');

const perfumeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    uri: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    concentration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    incredients: {
        type: String,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    targetAudience: {
        type: String,
        enum: ["Male", "Female", "Unisex"],
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands',
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Perfume', perfumeSchema);
