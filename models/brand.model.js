const { default: mongoose } = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Brand', brandSchema);
