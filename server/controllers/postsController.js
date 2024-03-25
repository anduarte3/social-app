const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require ('../models/posts');
const cookieParser = require('cookie-parser');

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

        const postsWithLikesCount = await Promise.all(posts.map(async post => {
            const postObject = post.toObject();
            const likesCount = post.likes.length;

            postObject.likesCount = likesCount;
            // Determine if the current user is the owner of the post
            postObject.isOwner = post.user_id.toString() === userId;
            return postObject;
        }));

        return res.status(200).json({ posts: postsWithLikesCount });
        
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

// ------------------------------ LIKES ------------------------------ //
exports.update_likes = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.sub;

    try {
        const post = await Post.findOne({_id: postId});
        
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        const likedPost = post.likes.some(like => like.user_id.equals(userId));

        if (!likedPost) {
            await Post.findByIdAndUpdate(
                postId,
                { $addToSet: { likes: { user_id: userId } } },
                { new: true } // Return the updated document
            );
            console.log('User has liked the post');
            // Handle the case where the user has already liked the post
            res.status(200).json({ liked: true, message: 'Like added successfully' });
        } else {
            await Post.findByIdAndUpdate(
                postId,
                { $pull: { likes: { user_id: userId } } },
                { new: true } 
            );
            console.log('User has unliked the post');
            // Handle the case where the user has not liked the post
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
    // console.log('USER Id ->', userId);
    // console.log('POST Id ->', postId);
    // console.log('COMMENT ->', comment);
    
    try {
        const post = await Post.findOne({_id: postId});

        if (!post) return res.status(404).json({ message: 'Post not found'});

        const commentPost = await Post.findByIdAndUpdate(postId,
            { $addToSet: { comments: { user_id: userId, content: comment} } },
            { new: true } 
        );

        if (commentPost) {
            console.log(commentPost);
            res.status(200).json({ commentPost: true, userId, message: 'Comment added successfully' });
        } 

    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.delete_comment = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.sub;
    const commentId = req.params.commentId;
    // console.log('USER Id ->', userId);
    // console.log('POST Id ->', postId);
    // console.log('COMMENT ->', commentId);

    try {
        const post = await Post.findOne({_id: postId});
        const comment = post.comments.find(comment => comment._id.equals(commentId));

        if (!post) return res.status(404).json({ message: 'Post not found'});
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Convert the comment's user_id to a string for comparison
        const commentUserId = comment.user_id.toString();

        if (userId === commentUserId) {
            post.comments.pull(commentId);
            await post.save();
            res.status(200).json({ message: 'Comment removed successfully' });
        } else {
            res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.update_comment = asyncHandler(async (req, res, next) => {
    // const postId = req.params.postId;
    // const userId = req.user.sub;
    // const commentId = req.params.commentId;
    // // console.log('USER Id ->', userId);
    // // console.log('POST Id ->', postId);
    // // console.log('COMMENT ->', commentId);

    // try {
    //     const post = await Post.findOne({_id: postId});
    //     const comment = post.comments.some(comment => comment._id.equals(commentId));

    //     if (!post) return res.status(404).json({ message: 'Post not found'});
    //     if (!comment) return res.status(404).json({ message: 'Comment not found' });

    //     post.comments.pull(commentId);
    //     await post.save();

    //     res.status(200).json({ message: 'Comment removed successfully' });
    // } catch (error) {
    //     console.error('Error updating comment:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }
});