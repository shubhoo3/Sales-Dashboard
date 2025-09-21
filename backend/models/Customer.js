const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  region: {
    type: String,
    required: true,
    enum: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania']
  },
  customerType: {
    type: String,
    required: true,
    enum: ['Enterprise', 'SMB', 'Individual']
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);