const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
});

module.exports = mongoose.model('Platform', platformSchema);
