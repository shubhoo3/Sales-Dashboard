const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  saleDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  region: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
saleSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('Sale', saleSchema);