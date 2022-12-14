const mongoose = require('mongoose');

const Post = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },

    likes: [String],

    comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'user_comment' }]

}, {
    timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('user_post', Post);