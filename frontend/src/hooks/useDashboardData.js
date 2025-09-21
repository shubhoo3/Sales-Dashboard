import { useState, useEffect, useCallback } from 'react';
import { analyticsAPI } from '../services/api';
import socketService from '../services/socket';

export const useDashboardData = (filters) => {
  const [data, setData] = useState({
    overview: null,
    topProducts: [],
    topCustomers: [],
    regionStats: [],
    salesTimeline: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAllData = useCallback(async () => {
    if (!filters.startDate || !filters.endDate) return;

    setLoading(true);
    setError(null);

    try {
      const [overview, topProducts, topCustomers, regionStats, salesTimeline] = 
        await Promise.all([
          analyticsAPI.getOverview(filters),
          analyticsAPI.getTopProducts(filters),
          analyticsAPI.getTopCustomers(filters),
          analyticsAPI.getRegionStats(filters),
          analyticsAPI.getSalesTimeline(filters),
        ]);

      setData({
        overview: overview.data,
        topProducts: topProducts.data,
        topCustomers: topCustomers.data,
        regionStats: regionStats.data,
        salesTimeline: salesTimeline.data,
      });
      
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Real-time updates handler
  const handleRealTimeUpdate = useCallback(() => {
    console.log('Received real-time update, refreshing data...');
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Setup real-time updates
  useEffect(() => {
    socketService.onAnalyticsUpdate(handleRealTimeUpdate);
    
    return () => {
      socketService.offAnalyticsUpdate(handleRealTimeUpdate);
    };
  }, [handleRealTimeUpdate]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchAllData,
  };
};

export const useSocketConnection = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socketService.disconnect();
    };
  }, []);

  return connected;
};