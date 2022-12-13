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
    follower_list: [String],
    following_list: [String],
    user_post: [post]
});



module.exports = mongoose.model('user_base', user);