const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');
const { userValidation } = require('../userValidation');
const { formatDate } = require('date-fns');

// ------------------------------ USERS ------------------------------ //
router.post('/api/register', authController.register_post);
router.post('/api/login',  authController.login_post);

// ------------------------------ POSTS ------------------------------ //
router.post('/api/post', userValidation, postsController.create_post);
router.get('/api/feedload', userValidation, postsController.get_posts);
router.delete('/api/post/:postId/delete', userValidation, postsController.delete_post);

// ----------------------------- COMMENTS ----------------------------- //
router.post('/api/post/:postId/comment/create', userValidation, postsController.create_comment);
//router.put('/api/post/:postId/comment/:commentId/edit', userValidation, postsController.update_comment);
router.delete('/api/post/:postId/comment/:commentId/delete', userValidation, postsController.delete_comment);

// ------------------------------ LIKES ------------------------------ //
router.put('/api/post/:postId/like', userValidation, postsController.update_likes);

module.exports = router;