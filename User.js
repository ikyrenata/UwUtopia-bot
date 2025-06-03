const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  currency: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  health: { type: Number, default: 100 },
  losses: { type: Number, default: 0 },
  luminaSent: { type: Number, default: 0 },
  weapons: { type: [String], default: [] },
  animals: { type: [String], default: [] },
  slotStats: {
    losses: { type: Number, default: 0 },
  },
  // Add other fields as needed
});

module.exports = mongoose.model('User', userSchema);
