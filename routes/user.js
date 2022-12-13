const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorisation');
const User = require('../models/user');


router.post('/follow/:id', authorize, async(req, res) => {
    try {
        const { id } = req.params;

        const getUser = await User.findOne({ _id: id });

        if (!getUser) {
            return res.status(401).send(`User with id ${id} not found`);
        }

        if (req.user.id == id) {
            return res.status(401).send('Cannot follow yourself');
        }
        const fetchCurrentUser = await User.findOne({ _id: req.user.id });

        let size = getUser.follower_list.length;
        fetchCurrentUser.follower_list = fetchCurrentUser.follower_list.filter(function(element) {
            return element.toString() !== id.toString();
        });

        if (size !== fetchCurrentUser.follower_list.length) {
            return res.status(401).send("Already Following");
        }

        fetchCurrentUser.following_list.push(id);
        getUser.follower_list.push(req.user.id);
        const updatedUserCurrent = await fetchCurrentUser.save();
        const updatedUserFriend = await getUser.save();

        return res.status(201).json({ updatedUserCurrent, updatedUserFriend });


    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.post('/unfollow/:id', authorize, async(req, res) => {
    try {
        const { id } = req.params;

        const getUser = await User.findOne({ _id: id });


        if (!getUser) {
            return res.status(401).send(`User with id ${id} not found`);
        }

        if (req.user.id == id) {
            return res.status(401).send('Cannot follow yourself');
        }

        const fetchCurrentUser = await User.findOne({ _id: req.user.id });
        let size = getUser.follower_list.length;
        fetchCurrentUser.following_list = fetchCurrentUser.following_list.filter(function(element) {
            return element.toString() !== id.toString();
        });


        if (size === fetchCurrentUser.following_list.length) {
            return res.status(401).send("Does not follow the user");
        }


        getUser.follower_list = getUser.follower_list.filter(function(element) {
            return element.toString() !== req.user.id.toString();
        });
        const updatedUserCurrent = await fetchCurrentUser.save();
        const updatedUserFriend = await getUser.save();

        return res.status(201).json({ updatedUserCurrent, updatedUserFriend });


    } catch (err) {
        return res.status(500).send(err.message);
    }
});


router.get('/user', authorize, async(req, res) => {

    try {
        const user = req.user.id;
        const fetchUser = await User.findOne({ _id: user });
        if (fetchUser) {
            return res.status(201).json({
                user_name: fetchUser.email,
                followers: fetchUser.follower_list.length,
                following: fetchUser.following_list.length
            })
        }
        return res.status(401).send("User not found");
    } catch (err) {
        return res.status(500).send(err.message);
    }

})










module.exports = router;