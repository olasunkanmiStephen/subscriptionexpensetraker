const express = require('express');
const Platform = require('../models/Platform');
const { authenticateToken } = require('../middleware/auth'); // Authentication middleware
const router = express.Router();

// Get a list of platforms for the authenticated user
router.get('/platforms', authenticateToken, async (req, res) => {
  try {
    const platforms = await Platform.find({ user: req.user.id }); // Fetch platforms belonging to the user
    res.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ message: 'Error fetching platforms' });
  }
});

// Add a new platform
router.post('/platforms', authenticateToken, async (req, res) => {
  const { name } = req.body;

  // Optionally validate input
  if (!name) {
    return res.status(400).json({ message: 'Platform name is required' });
  }

  try {
    const newPlatform = new Platform({
      name,
      user: req.user.id, // Associate the platform with the authenticated user
    });

    await newPlatform.save();
    res.status(201).json({ message: 'Platform added successfully', newPlatform });
  } catch (error) {
    console.error('Error adding platform:', error);
    res.status(500).json({ message: 'Error adding platform' });
  }
});

module.exports = router;
