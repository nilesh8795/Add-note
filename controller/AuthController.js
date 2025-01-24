const UserModel = require('../models/User.js'); // Assuming your User model is correctly defined
const jwt = require('jsonwebtoken');

// Register Function
const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists. Please login.",
        code: 400,
        error: true,
      }); 
    }

    // Create a new user
    const newUser = new UserModel({ name, email, password });
    const result = await newUser.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      code: 201,
      error: false,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "User registration failed",
      code: 500,
      error: true,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
        error: true,
      });
    }

    // Compare the plain text password
    if (user.password !== password) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
        error: true,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        profilePicture: user.profilePicture, // If you have a profile picture field
      },
      error: false,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({
      success: false,
      message: "Server error",
      error: true,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: 'No token provided',
        error: true,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch user data from the database
    const user = await UserModel.findById(userId).select('name profilePicture'); // You can add more fields as needed
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
        error: true,
      });
    }

    // Send user data as response
    res.status(200).send({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: true,
    });
  }
};

module.exports = {
  Register,
  login,
  getUserProfile
};
