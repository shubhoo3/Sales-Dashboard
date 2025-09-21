const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const { Customer, Product, Sale } = require('../models');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

const generateCustomers = async (count = 50) => {
  const customers = [];
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
  const customerTypes = ['Enterprise', 'SMB', 'Individual'];
  
  for (let i = 0; i < count; i++) {
    customers.push({
      name: faker.company.name(),
      email: faker.internet.email().toLowerCase(),
      region: faker.helpers.arrayElement(regions),
      customerType: faker.helpers.arrayElement(customerTypes),
      joinDate: faker.date.between({ from: '2022-01-01', to: '2024-01-01' })
    });
  }
  
  try {
    const savedCustomers = await Customer.insertMany(customers);
    console.log(`${savedCustomers.length} customers created`);
    return savedCustomers;
  } catch (error) {
    console.error('Error creating customers:', error);
    return [];
  }
};

const generateProducts = async (count = 30) => {
  const products = [];
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Automotive', 'Food & Beverage'];
  
  for (let i = 0; i < count; i++) {
    products.push({
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
      description: faker.commerce.productDescription(),
      inStock: faker.datatype.boolean()
    });
  }
  
  try {
    const savedProducts = await Product.insertMany(products);
    console.log(`${savedProducts.length} products created`);
    return savedProducts;
  } catch (error) {
    console.error('Error creating products:', error);
    return [];
  }
};

const generateSales = async (customers, products, count = 500) => {
  const sales = [];
  
  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const product = faker.helpers.arrayElement(products);
    const quantity = faker.number.int({ min: 1, max: 10 });
    const unitPrice = product.price;
    
    sales.push({
      customerId: customer._id,
      productId: product._id,
      quantity: quantity,
      unitPrice: unitPrice,
      totalAmount: quantity * unitPrice,
      saleDate: faker.date.between({ from: '2023-01-01', to: new Date() }),
      region: customer.region,
      status: faker.helpers.arrayElement(['completed', 'pending', 'cancelled'])
    });
  }
  
  try {
    const savedSales = await Sale.insertMany(sales);
    console.log(`${savedSales.length} sales created`);
    return savedSales;
  } catch (error) {
    console.error('Error creating sales:', error);
    return [];
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();
    
    console.log('Starting database seeding...');
    
    const customers = await generateCustomers(50);
    const products = await generateProducts(30);
    const sales = await generateSales(customers, products, 500);
    
    console.log('Database seeding completed successfully!');
    console.log(`Created: ${customers.length} customers, ${products.length} products, ${sales.length} sales`);
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };