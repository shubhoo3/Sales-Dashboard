// frontend/src/components/DataTables.js
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Skeleton,
  Chip,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Person,
  ShoppingBag,
} from '@mui/icons-material';

const DataTables = ({ data, loading }) => {
  const [productPage, setProductPage] = useState(0);
  const [customerPage, setCustomerPage] = useState(0);
  const [rowsPerPage] = useState(5);

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

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'Enterprise':
        return '#1976d2';
      case 'SMB':
        return '#388e3c';
      case 'Individual':
        return '#f57c00';
      default:
        return '#757575';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': '#2196f3',
      'Clothing': '#e91e63',
      'Home & Garden': '#4caf50',
      'Books': '#ff9800',
      'Sports': '#9c27b0',
      'Beauty': '#f06292',
      'Automotive': '#607d8b',
      'Food & Beverage': '#ff5722',
    };
    return colors[category] || '#757575';
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2].map((item) => (
          <Grid item xs={12} lg={6} key={item}>
            <Card elevation={2}>
              <CardHeader title={<Skeleton width="40%" />} />
              <CardContent>
                {[1, 2, 3, 4, 5].map((row) => (
                  <Box key={row} display="flex" alignItems="center" mb={1}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box ml={2} flex={1}>
                      <Skeleton width="60%" />
                      <Skeleton width="40%" />
                    </Box>
                    <Skeleton width="20%" />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Top Products Table */}
      <Grid item xs={12} lg={6}>
        <Card 
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <CardHeader 
            title="Top Products"
            titleTypographyProps={{ 
              variant: 'h6', 
              fontWeight: 600,
              sx: {
                background: 'linear-gradient(45deg, #fa709a 30%, #fee140 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
            avatar={<ShoppingBag color="primary" />}
          />
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Sales
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Revenue
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topProducts
                    ?.slice(productPage * rowsPerPage, productPage * rowsPerPage + rowsPerPage)
                    .map((product, index) => (
                      <TableRow 
                        key={product._id || index} 
                        hover
                        sx={{
                          transition: 'background 0.2s ease',
                          '&:hover': { backgroundColor: 'rgba(102,126,234,0.06)' },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 2,
                                bgcolor: getCategoryColor(product.category),
                                fontSize: '0.75rem',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                              }}
                            >
                              {product.name?.charAt(0) || 'P'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {product.name?.length > 25 
                                  ? `${product.name.substring(0, 25)}...` 
                                  : product.name
                                }
                              </Typography>
                              {product.category && (
                                <Chip
                                  label={product.category}
                                  size="small"
                                  sx={{ 
                                    fontSize: '0.65rem',
                                    height: 18,
                                    bgcolor: getCategoryColor(product.category),
                                    color: 'white',
                                    borderRadius: 2,
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2" fontWeight={600}>
                              {formatNumber(product.totalSales)}
                            </Typography>
                            <TrendingUp sx={{ ml: 0.5, fontSize: 14, color: '#4caf50' }} />
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700} color="primary">
                            {formatCurrency(product.revenue)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={data.topProducts?.length || 0}
              rowsPerPage={rowsPerPage}
              page={productPage}
              onPageChange={(event, newPage) => setProductPage(newPage)}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Top Customers Table */}
      <Grid item xs={12} lg={6}>
        <Card 
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <CardHeader 
            title="Top Customers"
            titleTypographyProps={{ 
              variant: 'h6', 
              fontWeight: 600,
              sx: {
                background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
            avatar={<Person color="primary" />}
          />
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Orders
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Total Spent
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topCustomers
                    ?.slice(customerPage * rowsPerPage, customerPage * rowsPerPage + rowsPerPage)
                    .map((customer, index) => (
                      <TableRow 
                        key={customer._id || index} 
                        hover
                        sx={{
                          transition: 'background 0.2s ease',
                          '&:hover': { backgroundColor: 'rgba(102,126,234,0.06)' },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 2,
                                bgcolor: getCustomerTypeColor(customer.customerType),
                                fontSize: '0.75rem',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                              }}
                            >
                              {customer.name?.charAt(0) || 'C'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {customer.name?.length > 25 
                                  ? `${customer.name.substring(0, 25)}...` 
                                  : customer.name
                                }
                              </Typography>
                              {customer.customerType && (
                                <Chip
                                  label={customer.customerType}
                                  size="small"
                                  sx={{ 
                                    fontSize: '0.65rem',
                                    height: 18,
                                    bgcolor: getCustomerTypeColor(customer.customerType),
                                    color: 'white',
                                    borderRadius: 2,
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {formatNumber(customer.orderCount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700} color="primary">
                            {formatCurrency(customer.totalSpent)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={data.topCustomers?.length || 0}
              rowsPerPage={rowsPerPage}
              page={customerPage}
              onPageChange={(event, newPage) => setCustomerPage(newPage)}
            />
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
};

export default DataTables;