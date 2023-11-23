const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const User = require('../models/user')

exports.create_post = asyncHandler(async (req, res, next) => {
    const user = await User.find({ username: req.body.username });
    console.log(user);
    console.log(req.body.username);
    console.log(req.body.postText);
    res.status(200).json('nice')
});