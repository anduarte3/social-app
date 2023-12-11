const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
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

exports.get_posts = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        const userId = decodedToken.sub;
        const posts = await Post.find();

        const postsWithOwnership = posts.map(post => {
            const postObject = post.toObject();
            postObject.isOwner = post.user_id.toString() === userId;
            return postObject;
        });

        return res.status(200).json({ posts: postsWithOwnership });

    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

exports.delete_post = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found'});
    }
    res.json({ message: 'Post deleted successfully' });
});

exports.update_post = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const { updatedContent } = req.body;
  
    // Implement logic to update the post in the database
  
    res.status(200).json({ message: 'Post updated successfully' });
});