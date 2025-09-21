# 📊 Sales Dashboard

A comprehensive sales analytics dashboard built with modern web technologies. Features real-time data visualization, interactive filters, and responsive design.

---

## 🚀 Features

- **Real-time Updates**: WebSocket integration for live data updates  
- **Interactive Filters**: Date range, region, and category filtering  
- **Rich Visualizations**: Charts and graphs using Recharts  
- **Data Tables**: Sortable and paginated tables for detailed views  
- **Responsive Design**: Mobile-friendly Material-UI components  
- **Performance Optimized**: MongoDB aggregation pipelines  
- **RESTful API**: Well-structured Express.js backend  

---

## 🛠 Tech Stack

### Backend
- Node.js with Express.js  
- MongoDB with Mongoose ODM  
- Socket.IO for real-time communication  
- Joi for data validation  

### Frontend
- React 18 with hooks  
- Material-UI (MUI) for UI components  
- Recharts for data visualization  
- Socket.IO Client for real-time updates  
- Date-fns for date manipulation  

---

## 📁 Project Structure


```
Sales-Dashboard/
├── backend/
│   ├── models/                 # MongoDB models
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   ├── Sale.js
│   │   ├── AnalyticsReport.js
│   │   └── index.js
│   ├── controllers/            # Route controllers
│   │   └── analyticsController.js
│   ├── middlewares/           # Custom middlewares
│   │   └── validation.js
│   ├── config/                # Configuration files
│   │   └── database.js
│   ├── utils/                 # Utility functions
│   │   └── seedData.js
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── DateFilter.js
│   │   │   ├── MetricsCards.js
│   │   │   ├── Charts.js
│   │   │   └── DataTables.js
│   │   ├── services/          # API services
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useDashboardData.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)  
- MongoDB (local installation or MongoDB Atlas)  
- npm or yarn  

### Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create a .env file
MONGODB_URI=mongodb://localhost:27017/sales_dashboard
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```
The backend will run on http://localhost:5000
Frontend Setup

Navigate to the frontend directory:

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# Start development server
npm start

The frontend will run on http://localhost:3000
📊 API Endpoints
Analytics Routes

GET /api/analytics/overview - Dashboard overview metrics
GET /api/analytics/products/top - Top-selling products
GET /api/analytics/customers/top - Top customers by spending
GET /api/analytics/regions - Revenue by region
GET /api/analytics/timeline - Sales timeline data
POST /api/analytics/generate-report - Generate analytics report

Query Parameters
All endpoints support the following query parameters:

startDate (required): Start date in ISO format
endDate (required): End date in ISO format
region (optional): Filter by specific region
category (optional): Filter by product category
limit (optional): Limit results (default: 10)

🎯 Key Features Explained
Real-time Updates

WebSocket connection for live data synchronization
Automatic refresh notifications
Connection status indicators

Interactive Filtering

Date range picker with presets
Region and category filters
Active filter display with easy removal

Data Visualization

Sales timeline with area charts
Revenue distribution pie charts
Top products bar charts
Dual-axis line charts for comparisons

Performance Optimization

MongoDB aggregation pipelines for complex queries
Database indexing for faster lookups
React hooks for efficient state management
Responsive design for all screen sizes

🔧 Configuration
Database Configuration
The app uses MongoDB with the following collections:

customers - Customer information
products - Product catalog
sales - Sales transactions
analyticsreports - Saved reports

Environment Variables
Backend

MONGODB_URI - MongoDB connection string
PORT - Server port (default: 5000)
NODE_ENV - Environment (development/production)
CLIENT_URL - Frontend URL for CORS

Frontend

REACT_APP_API_URL - Backend API URL
REACT_APP_SOCKET_URL - WebSocket server URL

# Screenshots

<img width="1401" height="491" alt="image" src="https://github.com/user-attachments/assets/56067ed5-8e4e-4445-8e2a-6f7981683b86" />
<img width="1890" height="727" alt="image" src="https://github.com/user-attachments/assets/9a43ca9d-b21e-4464-990d-cf25fc1450f4" />
<img width="1910" height="913" alt="image" src="https://github.com/user-attachments/assets/80ccdaec-98ff-40cd-b0e4-49daa7abc388" />
<img width="1917" height="861" alt="image" src="https://github.com/user-attachments/assets/45d79972-4fe0-403b-96ee-7c0dede0d4ac" />

