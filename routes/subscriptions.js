const express = require('express');
const Subscription = require('../models/Subscription');
const { authenticateToken } = require('../middleware/auth'); // Assuming you have an authentication middleware
const router = express.Router();

// Get subscriptions for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id }); // Find subscriptions belonging to the user
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Error fetching subscriptions' });
  }
  
});

// Create subscription route
router.post('/', authenticateToken, async (req, res) => {
  const { name, cost, renewalDate, category } = req.body;

  // Optionally validate the input here
  if (!name || !cost || !renewalDate || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newSubscription = new Subscription({
      name,
      cost,
      renewalDate,
      category,
      user: req.user.id, // Associate the subscription with the authenticated user
    });
    
    await newSubscription.save();
    res.status(201).json({ message: 'Subscription created successfully', newSubscription });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
});

// Edit subscription
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure only the user who created the subscription can update it
      req.body,
      { new: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found or you are not authorized to edit it' });
    }
    res.json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
});

// Delete subscription
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findOneAndDelete(
      { _id: req.params.id, user: req.user.id } // Ensure only the user who created the subscription can delete it
    );

    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Subscription not found or you are not authorized to delete it' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ message: 'Error deleting subscription', error: error.message });
  }
});

module.exports = router;
