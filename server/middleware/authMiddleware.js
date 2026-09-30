const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer scheme
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User account no longer exists'
        });
      }

      return next();
    } catch (error) {
      console.error('JWT Authentication Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token is invalid or expired'
      });
    }
  }

  // Token missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided'
    });
  }
};

module.exports = { protect };
