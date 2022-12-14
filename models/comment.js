const mongoose = require('mongoose');


const Comment = new mongoose.Schema({
    content: String
});


module.exports = mongoose.model('user_comment', Comment);