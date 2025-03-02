const { default: mongoose } = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Brand', brandSchema);
