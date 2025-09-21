import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';

const DateFilter = ({ filters, onFiltersChange, onRefresh, loading }) => {
  const handleDateChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleSelectChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value === '' ? undefined : value,
    });
  };

  const handlePresetClick = (preset) => {
    const today = new Date();
    let startDate, endDate;

    switch (preset) {
      case 'today':
        startDate = endDate = today;
        break;
      case 'last7':
        startDate = subDays(today, 7);
        endDate = today;
        break;
      case 'last30':
        startDate = subDays(today, 30);
        endDate = today;
        break;
      case 'thisMonth':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      case 'thisYear':
        startDate = startOfYear(today);
        endDate = endOfYear(today);
        break;
      default:
        return;
    }

    onFiltersChange({
      ...filters,
      startDate,
      endDate,
    });
  };

  const presets = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last7' },
    { label: 'Last 30 Days', value: 'last30' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'This Year', value: 'thisYear' },
  ];

  const regions = [
    'North America',
    'Europe',
    'Asia',
    'South America',
    'Africa',
    'Oceania'
  ];

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Books',
    'Sports',
    'Beauty',
    'Automotive',
    'Food & Beverage'
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Box 
          sx={{
            mr: 1.5,
            p: 1,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FilterListIcon />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Filters</Typography>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3}>
          {/* Date Range Presets */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Date Ranges:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {presets.map((preset) => (
                <Chip
                  key={preset.value}
                  label={preset.label}
                  onClick={() => handlePresetClick(preset.value)}
                  variant="outlined"
                  size="small"
                  clickable
                  sx={{
                    borderRadius: 2,
                    borderColor: 'rgba(0,0,0,0.08)',
                    '&:hover': {
                      borderColor: 'transparent',
                      background: 'linear-gradient(45deg, #667eea22, #764ba222)',
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>

          {/* Custom Date Range */}
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(value) => handleDateChange('startDate', value)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              maxDate={new Date()}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(value) => handleDateChange('endDate', value)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={filters.startDate}
              maxDate={new Date()}
            />
          </Grid>

          {/* Region Filter */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Region</InputLabel>
              <Select
                value={filters.region || ''}
                label="Region"
                onChange={(e) => handleSelectChange('region', e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Regions</MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category || ''}
                label="Category"
                onChange={(e) => handleSelectChange('category', e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Refresh Button */}
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={onRefresh}
              disabled={loading}
              startIcon={<RefreshIcon />}
              fullWidth
              sx={{ 
                height: '56px',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                }
              }}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>

      {/* Active Filters Display */}
      {(filters.startDate || filters.endDate || filters.region || filters.category) && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Active Filters:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {filters.startDate && (
              <Chip
                label={`From: ${format(filters.startDate, 'MMM dd, yyyy')}`}
                size="small"
                color="primary"
                sx={{ borderRadius: 2 }}
              />
            )}
            {filters.endDate && (
              <Chip
                label={`To: ${format(filters.endDate, 'MMM dd, yyyy')}`}
                size="small"
                color="primary"
                sx={{ borderRadius: 2 }}
              />
            )}
            {filters.region && (
              <Chip
                label={`Region: ${filters.region}`}
                size="small"
                color="secondary"
                onDelete={() => handleSelectChange('region', '')}
                sx={{ borderRadius: 2 }}
              />
            )}
            {filters.category && (
              <Chip
                label={`Category: ${filters.category}`}
                size="small"
                color="secondary"
                onDelete={() => handleSelectChange('category', '')}
                sx={{ borderRadius: 2 }}
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default DateFilter;
