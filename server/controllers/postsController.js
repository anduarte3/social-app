const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require ('../models/posts');

// ------------------------------ POSTS ------------------------------ //
exports.create_post = asyncHandler(async (req, res, next) => {
    console.log(req.user.sub);
    const user = await User.findOne({ _id: req.user.sub });

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
        const userId = req.user.sub;
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

// Update means Edit, to be implemented
exports.update_post = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const { updatedContent } = req.body;

    res.status(200).json({ message: 'Post updated successfully' });
});

// ------------------------------ COMMENTS ------------------------------ //


// ------------------------------ LIKES ------------------------------ //
exports.update_likes = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.sub;

    try {
        const existingPost = await Post.findOne({
            'likes': { $elemMatch: { 'user_id': userId }}
        });
    
        if (!existingPost) {
            const updatedPost = await Post.findOneAndUpdate(
                { _id: postId },
                { $addToSet: { likes: { user_id: userId } } },
                { new: true }
            );
            console.log('Like added:', updatedPost);
            res.status(200).json({ liked: true, message: 'Like added successfully' });
        } else {
            const updatedPost = await Post.findOneAndUpdate(
                { _id: postId, 'likes.user_id': userId },
                { $pull: { likes: { user_id: userId } } },
                { new: true }
            );
            console.log('Like removed:', updatedPost);
            res.status(200).json({ liked: false, message: 'Like removed successfully' });
        }
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});