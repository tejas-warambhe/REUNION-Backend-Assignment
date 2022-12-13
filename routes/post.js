const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorisation');
const User = require('../models/user');

router.post('/posts', authorize, async(req, res) => {
    try {
        const { title, description } = req.body;

        const currentUser = await User.findOne({ _id: req.user.id });
        console.log(currentUser);
        if (currentUser) {
            currentUser.user_post.push({
                title: title,
                desc: description
            });
            const updatedUser = await currentUser.save();
            return res.status(201).json({ updatedUser });
        }

        return res.status(401).send("User not found");


    } catch (err) {
        return res.status(500).send(err.message);
    }
})





module.exports = router;