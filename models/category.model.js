const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subtypes: [{
        type: String
    }],
    examples: [{
        type: String
    }],
})

module.exports = mongoose.model('Category', categorySchema);
