const jwt = require('jsonwebtoken');

// User Validation
const userValidation = (req, res, next) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
      }
  
      const decodedToken = jwt.verify(token, 'cats'); // Replace with your actual secret key
      req.user = decodedToken; // Add user information to the request object
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports = { userValidation };