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
    .escape(),
    
    body('formData.email')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    
    body('formData.password').isLength({ min: 6 }).withMessage("Password is too short!"),
    body('formData.confirmPassword').isLength({ min: 6}).withMessage("Confirm password is too short!").custom((value, { req }) => {
        return value === req.body.formData.password
    }).withMessage('Passwords do not match.'),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const existingUser = await User.find({ username: req.body.formData.username });
        const existingEmail = await User.find({ email: req.body.formData.email });
        const errors = validationResult(req);
        let errorValidation = errors.array();
        let errorInfo = [];       
        
        // To add all errors into a single array
        errorValidation.forEach((e) => errorInfo.push({msg: e.msg}))
        
        if (existingUser) {
            // Push to the beginning of the array
            errorInfo.unshift({ msg: 'The username is already taken.' })            
        }
        if (existingEmail) errorInfo.unshift({ msg: 'The email is already taken.' })
        
        if (!errors.isEmpty()) {
            // If there are validation errors, send a JSON response with the errors
            
            res.status(400).json({ errorInfo });
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