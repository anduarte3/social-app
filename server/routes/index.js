const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');

// ------------------------------ REGISTER ------------------------------ //
router.post('/api/register', authController.register_post);

// ------------------------------ LOGIN/LOGOUT ------------------------------ //
router.post('/api/login',  authController.login_post);

// ------------------------------ POSTS ------------------------------ //
router.post('/api/post', postsController.create_post);
router.get('/api/feedload', postsController.get_posts);
router.put('/api/post/:postId', postsController.update_post);
router.delete('/api/post/:postId', postsController.delete_post);

module.exports = router;