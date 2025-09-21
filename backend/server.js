const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const { validateAnalyticsQuery, errorHandler } = require('./middlewares/validation');
const analyticsController = require('./controllers/analyticsController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sales Dashboard API is running' });
});

// Analytics routes
app.get('/api/analytics/overview', validateAnalyticsQuery, analyticsController.getDashboardOverview);
app.get('/api/analytics/products/top', validateAnalyticsQuery, analyticsController.getTopProducts);
app.get('/api/analytics/customers/top', validateAnalyticsQuery, analyticsController.getTopCustomers);
app.get('/api/analytics/regions', validateAnalyticsQuery, analyticsController.getRegionStats);
app.get('/api/analytics/timeline', validateAnalyticsQuery, analyticsController.getSalesTimeline);
app.post('/api/analytics/generate-report', validateAnalyticsQuery, analyticsController.generateAndSaveReport);

// Error handling middleware
app.use(errorHandler);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('subscribe-analytics', (filters) => {
    socket.join('analytics-room');
    console.log('Client subscribed to analytics updates');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate real-time data updates (in production, this would be triggered by actual data changes)
setInterval(async () => {
  try {
    // Emit updated metrics to all connected clients
    io.to('analytics-room').emit('analytics-update', {
      timestamp: new Date(),
      type: 'metrics-refresh'
    });
  } catch (error) {
    console.error('Real-time update error:', error);
  }
}, 30000); // Every 30 seconds

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});