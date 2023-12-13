const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');
const { userValidation } = require('../userValidation');

// ------------------------------ USERS ------------------------------ //
router.post('/api/register', authController.register_post);
router.post('/api/login',  authController.login_post);

// ------------------------------ POSTS ------------------------------ //
router.post('/api/post', userValidation, postsController.create_post);
router.get('/api/feedload', userValidation, postsController.get_posts);
router.put('/api/post/:postId', userValidation, postsController.update_post);
router.delete('/api/post/:postId', userValidation, postsController.delete_post);

// ----------------------------- COMMENTS ----------------------------- //

// ------------------------------ LIKES ------------------------------ //
router.put('/api/post/:postId/like', userValidation, postsController.update_likes);

module.exports = router;