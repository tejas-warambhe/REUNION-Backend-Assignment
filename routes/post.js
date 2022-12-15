const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorisation');
const User = require('../models/user');
const Post = require('../models/post');
const UserComment = require('../models/comment');
const { default: mongoose } = require('mongoose');
const { populate } = require('../models/user');


router.post('/posts', authorize, async(req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(401).send("Insufficient Data");
        }
        const currentUser = await User.findOne({ _id: req.user.id });

        const newPost = new Post({
            title: title,
            desc: description
        });

        const savedPost = await newPost.save();

        currentUser.user_post.push(savedPost._id);

        await currentUser.save();

        return res.status(201).json({
            post_id: savedPost._id,
            title: savedPost.title,
            description: savedPost.desc,
            created_at: savedPost.createdAt
        });


    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.delete('/posts/:id', authorize, async(req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).send("Incorrect ID")
        }
        const currentUser = await User.findOne({ _id: req.user.id });
        const hasPosted = 0;
        currentUser.user_post.forEach((element) => {
            hasPosted += (element.toHexString() === id);
        });


        if (hasPosted > 0) {
            const deletedPost = await Post.findByIdAndDelete({ _id: id });
            currentUser.user_post = currentUser.user_post.filter((element) => {

                return element.toHexString() !== id;
            })
            await currentUser.save();
            return res.status(201).json({ deletedPost });
        }

        return res.status(401).send("Unauthorized");


    } catch (err) {
        return res.status(500).send(err.message);
    }
});


router.post('/like/:id', authorize, async(req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).send("Incorrect ID")
        }
        const currentPost = await Post.findOne({ _id: id });
        let hasLiked = 0;
        currentPost.likes.forEach((element) => {
            hasLiked += (element === req.user.id);
        });

        if (hasLiked > 0) {
            return res.status(401).send("Already liked this post");
        }

        currentPost.likes.push(req.user.id);
        await currentPost.save();

        return res.status(201).json({ success: true, message: "Post liked" });

    } catch (err) {
        return res.status(500).send(err.message);
    }
})

router.post('/unlike/:id', authorize, async(req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).send("Incorrect ID")
        }
        const currentPost = await Post.findOne({ _id: id });

        let hasLiked = 0;
        currentPost.likes.forEach((element) => {
            hasLiked += (element === req.user.id);
        });

        if (hasLiked === 0) {
            return res.status(401).send("The post was not liked by the user");
        }
        currentPost.likes = currentPost.likes.filter((element) => {

            return element !== req.user.id;
        })
        await currentPost.save();
        return res.status(201).json({ success: true, message: "Post unliked" })

    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.post('/comment/:id', authorize, async(req, res) => {

    try {
        const { id } = req.params;
        const { Comment } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).send("Incorrect ID")
        }
        const currentPost = await Post.findOne({ _id: id });
        if (currentPost) {
            const newComment = new UserComment({
                content: Comment
            });
            const addComment = await newComment.save();

            currentPost.comments.push(addComment._id);
            await currentPost.save();
            return res.status(201).json({
                comment_id: newComment._id,
            })
        }

        return res.status(401).send("Post does not exist");

    } catch (err) {
        return res.status(500).send(err.message);
    }

});

router.get('/posts/:id', async(req, res) => {

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).send("Incorrect ID")
        }

        const getPost = await Post.findOne({ _id: id }).populate('comments');

        if (getPost) {
            return res.status(201).json({
                post_id: getPost._id,
                title: getPost.title,
                description: getPost.desc,
                likes: getPost.likes.length,
                comments: getPost.comments
            });
        }

        return res.status(401).send("No post found");

    } catch (err) {
        return res.status(500).send(err.message);
    }
});


router.get('/all_posts', authorize, async(req, res) => {
    try {

        let allPosts = await User.find({ _id: req.user.id }).populate({
            path: 'user_post',
            model: 'user_post',
            populate: {
                path: 'comments',
                model: 'user_comment',
                options: {
                    sort: { 'createdAt': 1 }
                }
            }
        });



        if (allPosts) {
            return res.status(201).json({
                all_posts: allPosts
            })
        }
        return res.status(401).send("User not found");
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

module.exports = router;