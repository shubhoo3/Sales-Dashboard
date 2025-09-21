const mongoose = require('mongoose');

const analyticsReportSchema = new mongoose.Schema({
  reportDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateRange: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  totalRevenue: {
    type: Number,
    required: true
  },
  totalSales: {
    type: Number,
    required: true
  },
  avgOrderValue: {
    type: Number,
    required: true
  },
  topProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    totalSales: Number,
    revenue: Number
  }],
  topCustomers: [{
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    name: String,
    totalSpent: Number,
    orderCount: Number
  }],
  regionStats: [{
    region: String,
    revenue: Number,
    salesCount: Number,
    avgOrderValue: Number
  }],
  salesByDate: [{
    date: Date,
    revenue: Number,
    salesCount: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);