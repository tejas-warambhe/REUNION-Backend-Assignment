const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorisation');
const User = require('../models/user');


router.post('/follow/:id', authorize, async(req, res) => {
    try {
        const { id } = req.params;

        const getUser = await User.findOne({ _id: id });
        console.log(getUser);
        if (!getUser) {
            return res.status(401).send(`User with id ${id} not found`);
        }

        if (req.user == id) {
            return res.status(401).send('Cannot follow yourself');
        }

        const updatedUser = await User.findOneAndUpdate({ _id: id }, { $set: { followers: getUser.followers + 1 } }, { new: true })

        return res.status(201).json({ updatedUser });


    } catch (err) {
        return res.status(500).send(err.message);
    }
})











module.exports = router;