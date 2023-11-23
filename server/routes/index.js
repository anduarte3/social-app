const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');

// ------------------------------ REGISTER ------------------------------ //
router.post('/api/register', authController.register_post);

// ------------------------------ LOGIN/LOGOUT ------------------------------ //
router.post('/api/login',  authController.login_post);

// ------------------------------ CREATE POST ------------------------------ //
router.post('/api/post', postsController.create_post)

module.exports = router;