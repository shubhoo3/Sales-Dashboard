import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sales-dashboard-9k3x.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Invalid request parameters');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw new Error(error.response?.data?.error || 'An unexpected error occurred');
  }
);

// Analytics API methods
export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getTopProducts: (params) => api.get('/analytics/products/top', { params }),
  getTopCustomers: (params) => api.get('/analytics/customers/top', { params }),
  getRegionStats: (params) => api.get('/analytics/regions', { params }),
  getSalesTimeline: (params) => api.get('/analytics/timeline', { params }),
  generateReport: (params) => api.post('/analytics/generate-report', {}, { params }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
