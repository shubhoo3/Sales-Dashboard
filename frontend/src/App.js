import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Tooltip,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Dashboard,
  Wifi,
  WifiOff,
  Notifications,
} from '@mui/icons-material';
import { subDays } from 'date-fns';

// Components
import DateFilter from './components/DateFilter';
import MetricsCards from './components/MetricsCards';
import Charts from './components/Charts';
import DataTables from './components/DataTables';

// Hooks
import { useDashboardData, useSocketConnection } from './hooks/useDashboardData';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#4c63d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f093fb',
      light: '#f5576c',
      dark: '#c471ed',
    },
    success: {
      main: '#4facfe',
      light: '#00f2fe',
      dark: '#43e97b',
    },
    warning: {
      main: '#ffecd2',
      light: '#fcb69f',
      dark: '#ff9a9e',
    },
    error: {
      main: '#ff6b6b',
      light: '#ff8e8e',
      dark: '#ff5252',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

function App() {
  // State for filters
  const [filters, setFilters] = useState({
    startDate: subDays(new Date(), 30), // Last 30 days by default
    endDate: new Date(),
    region: undefined,
    category: undefined,
    limit: 10,
  });

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Custom hooks
  const { data, loading, error, lastUpdated, refetch } = useDashboardData(filters);
  const isConnected = useSocketConnection();

  // Handle real-time connection status
  useEffect(() => {
    if (isConnected) {
      setNotification({
        open: true,
        message: 'Connected to real-time updates',
        severity: 'success',
      });
    } else {
      setNotification({
        open: true,
        message: 'Real-time connection lost',
        severity: 'warning',
      });
    }
  }, [isConnected]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    setNotification({
      open: true,
      message: 'Data refreshed successfully',
      severity: 'success',
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Sales Dashboard
          </Typography>
          
          {/* Connection Status */}
          <Tooltip title={isConnected ? 'Connected' : 'Disconnected'}>
            <IconButton color="inherit">
              {isConnected ? (
                <Wifi sx={{ color: '#4caf50' }} />
              ) : (
                <WifiOff sx={{ color: '#f44336' }} />
              )}
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 5, mb: 4 }}>
        {/* Header */}
        <Box 
          mb={4} 
          sx={{
            textAlign: 'center',
            position: 'relative',
            py: 4,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '4px',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              borderRadius: '2px',
            }
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#ffffff',            // 👈 make text white
              background: 'none !important', // 👈 remove gradient
              WebkitTextFillColor: 'unset !important', // 👈 ensure solid color shows
            }}
          >
            Sales Analytics Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Monitor your sales performance with real-time insights and interactive visualizations
          </Typography>
          
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              borderRadius: '50%',
              opacity: 0.6,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              borderRadius: '50%',
              opacity: 0.4,
            }}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => window.location.reload()}>
            {error}
          </Alert>
        )}

        {/* Date Filter */}
        <DateFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
          loading={loading}
        />

        {/* Metrics Cards */}
        <MetricsCards
          data={data.overview}
          loading={loading}
          lastUpdated={lastUpdated}
        />

        {/* Charts */}
        <Box mb={6}>
          <Charts data={data} loading={loading} />
        </Box>

        {/* Data Tables */}
        <DataTables data={data} loading={loading} />

        {/* Footer */}
        <Box 
          mt={6} 
          py={4} 
          textAlign="center"
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mx: -2,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 500,
              mb: 1,
            }}
          >
            © 2024 Sales Dashboard. Built with React, Node.js, and MongoDB.
          </Typography>
          {lastUpdated && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                display: 'block',
              }}
            >
              Last updated: {lastUpdated.toLocaleString()}
            </Typography>
          )}
        </Box>
      </Container>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;