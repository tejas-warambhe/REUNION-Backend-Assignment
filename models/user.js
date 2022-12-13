const mongoose = require('mongoose');

const post = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },

}, {
    timestamps: { createdAt: true, updatedAt: false }
})


const user = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    user_post: [post]
});



module.exports = mongoose.model('user_base', user);