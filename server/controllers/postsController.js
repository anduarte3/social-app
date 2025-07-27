const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require ('../models/posts');
const cookieParser = require('cookie-parser');

// ------------------------------ POSTS ------------------------------ //
exports.create_post = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.sub });

    if (user) {
        const newPost = new Post({
            user_id: user._id,
            content: req.body.postText.post,
            comments: [],
            likes: []
        })
        await newPost.save();

        const postObject = newPost.toObject();
        postObject.isOwner = newPost.user_id.toString() === req.user.sub;

        const io = req.app.get('io');
        io.emit('new_post', postObject);
        
        return res.status(200).json({ post: postObject });
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});

exports.get_posts = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user.sub;
        const posts = await Post.find();

        const postsWithLikesCount = await Promise.all(posts.map(async post => {
            const postObject = post.toObject();
            const user = await User.findById(post.user_id);

            postObject.liked = post.likes.some(like => like.user_id.equals(userId));
            postObject.username = user ? user.username : null;
            
            // Determine if the current user is the owner of the post
            postObject.isOwner = post.user_id.toString() === userId;
            

            return postObject;
        }));

        return res.status(200).json({ posts: postsWithLikesCount });
        
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.delete_post = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;

    const deletedPost = await Post.findByIdAndDelete(postId);
    
    if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found'});
    }

    const io = req.app.get('io');
    io.emit('post_deleted', postId);

    res.json({ message: 'Post deleted successfully' });
});

// ------------------------------ LIKES ------------------------------ //
exports.update_likes = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.sub;

    try {
        const post = await Post.findOne({_id: postId});
        const likedPost = post.likes.some(like => like.user_id.equals(userId));
        let updatedPost;

        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        if (!likedPost) {
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                { $addToSet: { likes: { user_id: userId } } },
                { new: true }
            );

            const postObject = updatedPost.toObject();
            postObject.isOwner = updatedPost.user_id.toString() === userId;

            const io = req.app.get('io');
            io.emit('post_updated', postObject);

            res.status(200).json({ liked: true, message: 'Like added successfully' });
        } else {
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                { $pull: { likes: { user_id: userId } } },
                { new: true } 
            );

            const postObject = updatedPost.toObject();
            postObject.isOwner = updatedPost.user_id.toString() === userId;

            const io = req.app.get('io');
            io.emit('post_updated', postObject);
            
            res.status(200).json({ liked: false, message: 'Like removed successfully' });
        }
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ------------------------------ COMMENTS ------------------------------ //
exports.create_comment = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.sub;
    const comment = req.body.commentText;
    
    try {
        const post = await Post.findOne({_id: postId});

        if (!post) return res.status(404).json({ message: 'Post not found'});

        const updatedPost = await Post.findByIdAndUpdate(postId,
            { $addToSet: { comments: { user_id: userId, content: comment} } },
            { new: true } 
        );

        if (updatedPost) {
            const postObject = updatedPost.toObject();
            postObject.isOwner = updatedPost.user_id.toString() === userId;

            const io = req.app.get('io');
            io.emit('post_updated', postObject);

            res.status(200).json({ commentPost: true, userId, message: 'Comment added successfully' });
        } 

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.delete_comment = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.sub;
    const commentId = req.params.commentId;

    try {
        const post = await Post.findOne({_id: postId});
        const comment = post.comments.find(comment => comment._id.equals(commentId));

        if (!post) return res.status(404).json({ message: 'Post not found'});
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const commentUserId = comment.user_id.toString();

        if (userId === commentUserId) {
            post.comments.pull(commentId);
            const updatedPost = await post.save(); // Store the result

            // Add Socket.IO emit
            const postObject = updatedPost.toObject();
            postObject.likesCount = updatedPost.likes.length;
            postObject.isOwner = updatedPost.user_id.toString() === userId;

            const io = req.app.get('io');
            io.emit('post_updated', postObject);

            res.status(200).json({ message: 'Comment removed successfully' });
        } else {
            res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});