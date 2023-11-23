const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user')
const { signToken }  = require('../auth');

// ------------------------------ VALIDATION ------------------------------ //
exports.register_post = [
    // Validate and sanitize fields
    body('formData.username')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Username must be specified.'),
    
    body('formData.email')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Email must be specified.'),
    
    body('formData.password').isLength({ min: 6 }),
    body('formData.confirmPassword').custom((value, { req }) => {
        return value === req.body.formData.password
    }).withMessage('Passwords do not match.'),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Find if Username and Email are taken in database
        const takenUsername = await User.find({ username: req.body.formData.username });
        const takenEmail = await User.find({ email: req.body.formData.email });
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // If there are validation errors, send a JSON response with the errors
            const errorValidation = errors.array() 
            res.status(400).json({ errorValidation });
        } else if (takenUsername.length > 0 || takenEmail.length > 0) {
            res.status(400).json({ errorMessages: [{ msg: 'Username or Email already taken'}]});
        } else {
            bcrypt.hash(req.body.formData.password, 10, async (err, hashedPassword) => {
                if (err) return next(err)
                else {
                    // Create new user with escaped and trimmed data
                    const addUser = new User({
                        username: req.body.formData.username,
                        email: req.body.formData.email,
                        password: hashedPassword,
                    });
                    // Save to database
                    await addUser.save();
                    res.status(200).json({ message: 'Your account has been created!'});
                }                
            });
        }
    })
]

// ------------------------------ AUTH ------------------------------ //
exports.login_post =  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Authentication failed
        return res.status(401).json({ message: info.message });
      }
      // Authentication succeeded, login and send a JWT token
      const token = signToken(user);
        res.json({ message: 'Login successful', token });
    })(req, res, next);
};