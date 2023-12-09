const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require ('../models/posts');

exports.create_post = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
        const newPost = new Post({
            user_id: user._id,
            content: req.body.postText.post,
            comments: [],
            likes: []
        })
        await newPost.save();
        return res.status(200).json({ post: newPost });
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});

exports.load_post = asyncHandler(async (req, res, next) => {
    try {
        const posts = await Post.find();

        const hehe = {};

        posts.forEach(async post => {
            const hasUserPost = await User.findOne(post.user_id)
            if (hasUserPost) {
                hehe.hasUserPost = hasUserPost;
                console.log(hehe);
            }
        })

        // const user = await User.findOne( posts[0].user_id)
        // console.log('this is user', user);
        // console.log('this is posts', posts[0]);
        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
