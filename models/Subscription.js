const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  renewalDate: { type: Date, required: true },
  category: { type: String, required: true },
  platform: { type: String, required: true }, // New platform field
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User reference
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
