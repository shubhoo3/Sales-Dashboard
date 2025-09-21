const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await createIndexes();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const { Sale } = require('../models');
    
    // Create indexes on frequently queried fields
    await Sale.collection.createIndex({ saleDate: 1 });
    await Sale.collection.createIndex({ customerId: 1 });
    await Sale.collection.createIndex({ productId: 1 });
    await Sale.collection.createIndex({ region: 1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

module.exports = connectDB;