const { default: mongoose } = require("mongoose");

const memberSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);