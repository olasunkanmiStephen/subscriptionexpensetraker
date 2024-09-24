const express = require('express');
const Subscription = require('../models/Subscription');
const router = express.Router();

// Get subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Error fetching subscriptions' });
  }
});

// Create subscription route
router.post('/', async (req, res) => {
  const { name, cost, renewalDate, category } = req.body;

  // Optionally validate the input here
  if (!name || !cost || !renewalDate || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newSubscription = new Subscription({ name, cost, renewalDate, category });
    await newSubscription.save();
    res.status(201).json({ message: 'Subscription created successfully', newSubscription });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
});

// Edit subscription
router.put('/:id', async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
});

// Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ message: 'Error deleting subscription', error: error.message });
  }
});

module.exports = router;
