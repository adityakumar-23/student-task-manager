const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate presence of all fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields (Name, Email, Password, Confirm Password) are required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match'
      });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email already exists'
      });
    }

    // Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    if (user) {
      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to Student Task Manager.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data received'
      });
    }
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Authenticate student & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find student by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
// @access  Private (JWT protected)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching profile'
    });
  }
};

// @desc    Update student profile (name, email)
// @route   PUT /api/auth/profile
// @access  Private (JWT protected)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, email } = req.body;

    if (name) {
      user.name = name.trim();
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      // Check if another user already has this email
      if (normalizedEmail !== user.email) {
        const emailTaken = await User.findOne({ email: normalizedEmail });
        if (emailTaken) {
          return res.status(400).json({
            success: false,
            message: 'Email address is already in use by another account'
          });
        }
        user.email = normalizedEmail;
      }
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating profile'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
