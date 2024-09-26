const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' }); // User already exists
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    // Return the user data (excluding password)
    res.status(201).json({ user: { username, email } }); // Returning relevant user info
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error'); // Handle errors appropriately
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and compare passwords
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' }); // Provide meaningful error
    }

    // Create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expiration

    // Return token and user info (excluding password)
    res.json({
      token,
      user: { username: user.username, email: user.email } // Returning relevant user info
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error'); // Handle errors appropriately
  }
});

module.exports = router;
