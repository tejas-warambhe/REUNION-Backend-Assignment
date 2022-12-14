const mongoose = require('mongoose');


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
    user_post: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'user_post' }]
});



module.exports = mongoose.model('user_base', user);