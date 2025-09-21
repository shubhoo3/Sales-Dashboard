import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AttachMoney,
  Assessment,
  Speed,
} from '@mui/icons-material';

// Animated Counter Component
const AnimatedCounter = ({ value, formatter, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value && value !== displayValue) {
      setIsAnimating(true);
      const startValue = displayValue;
      const endValue = value;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, duration]);

  return (
    <Typography
      variant="h4"
      sx={{ 
        fontWeight: 700,
        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 1,
        lineHeight: 1.2,
        fontSize: { xs: '1.5rem', md: '2rem' },
        transition: 'all 0.3s ease',
      }}
    >
      {formatter(displayValue)}
    </Typography>
  );
};

const MetricsCards = ({ data, loading, lastUpdated }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: data?.totalRevenue || 0,
      formatter: formatCurrency,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      trend: 8.2,
      trendDirection: 'up',
      progress: 75,
    },
    {
      title: 'Total Sales',
      value: data?.totalSales || 0,
      formatter: formatNumber,
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
      trend: 5.7,
      trendDirection: 'up',
      progress: 68,
    },
    {
      title: 'Average Order Value',
      value: data?.avgOrderValue || 0,
      formatter: formatCurrency,
      icon: <Speed sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(250, 112, 154, 0.1) 0%, rgba(254, 225, 64, 0.1) 100%)',
      trend: 3.4,
      trendDirection: 'up',
      progress: 82,
    },
    {
      title: 'Growth Rate',
      value: 12.5, // This would be calculated based on period comparison
      formatter: (val) => `${val.toFixed(1)}%`,
      icon: <Assessment sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(168, 237, 234, 0.1) 0%, rgba(254, 214, 227, 0.1) 100%)',
      trend: -2.1,
      trendDirection: 'down',
      progress: 45,
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box ml={2} flex={1}>
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      {lastUpdated && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Chip
            label={`Last updated: ${lastUpdated.toLocaleTimeString()}`}
            size="small"
            variant="outlined"
          />
        </Box>
      )}
      
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card 
              elevation={0}
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  '& .metric-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                  '& .progress-bar': {
                    '& .MuiLinearProgress-bar': {
                      animation: 'pulse 1.5s ease-in-out infinite',
                    },
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: metric.gradient,
                  borderRadius: '16px 16px 0 0',
                },
              }}
            >
              <CardContent sx={{ p: 3.5, pb: '28px !important' }}>
                {/* Background decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: metric.bgGradient,
                    opacity: 0.6,
                  }}
                />
                
                {/* Header with icon */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: 'text.primary',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {metric.title}
                  </Typography>
                  <Box
                    className="metric-icon"
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      background: metric.gradient,
                      color: 'white',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {metric.icon}
                  </Box>
                </Box>
                
                {/* Value */}
                <AnimatedCounter
                  value={metric.value}
                  formatter={metric.formatter}
                />
                
                {/* Progress Bar */}
                <Box mb={2}>
                  <LinearProgress
                    variant="determinate"
                    value={metric.progress}
                    className="progress-bar"
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: metric.gradient,
                      },
                    }}
                  />
                </Box>
                
                {/* Trend indicator */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    {metric.trendDirection === 'up' ? (
                      <TrendingUp 
                        sx={{ 
                          fontSize: 18, 
                          color: '#10b981',
                          mr: 0.5 
                        }} 
                      />
                    ) : (
                      <TrendingDown 
                        sx={{ 
                          fontSize: 18, 
                          color: '#ef4444',
                          mr: 0.5 
                        }} 
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: metric.trendDirection === 'up' ? '#10b981' : '#ef4444',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      {metric.trendDirection === 'up' ? '+' : ''}{metric.trend}%
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                    }}
                  >
                    vs last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricsCards;