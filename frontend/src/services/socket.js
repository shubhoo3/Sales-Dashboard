import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://sales-dashboard-9k3x.onrender.com';
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server via WebSocket');
      this.subscribeToAnalytics();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToAnalytics(filters = {}) {
    if (this.socket) {
      this.socket.emit('subscribe-analytics', filters);
    }
  }

  onAnalyticsUpdate(callback) {
    if (this.socket) {
      this.socket.on('analytics-update', callback);
    }
  }

  offAnalyticsUpdate(callback) {
    if (this.socket) {
      this.socket.off('analytics-update', callback);
    }
  }

  // Generic event listener management
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store the callback for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored callbacks
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
      }
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
