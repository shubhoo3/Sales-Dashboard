import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const Charts = ({ data, loading }) => {
  // Modern color palette with gradients
  const colors = [
    '#667eea', '#764ba2', '#4facfe', '#00f2fe', '#fa709a', 
    '#fee140', '#a8edea', '#fed6e3', '#ffecd2', '#fcb69f'
  ];

  const gradientColors = [
    'url(#gradient1)', 'url(#gradient2)', 'url(#gradient3)', 
    'url(#gradient4)', 'url(#gradient5)'
  ];

  // Enhanced custom tooltip
  const CurrencyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            minWidth: 150,
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ 
                color: entry.color, 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              <span>{entry.name}:</span>
              <span>${entry.value?.toLocaleString()}</span>
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Format timeline data for charts
  const timelineData = data.salesTimeline?.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
    revenue: Math.round(item.revenue),
  })) || [];

  // Format region data for pie chart
  const regionData = data.regionStats?.map((region, index) => ({
    ...region,
    fill: colors[index % colors.length],
  })) || [];

  // Format products for bar chart
  const productsData = data.topProducts?.slice(0, 10).map(product => ({
    ...product,
    name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
    revenue: Math.round(product.revenue),
  })) || [];

  if (loading) {
    return (
      <Grid container spacing={4} sx={{ p: 2 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} md={6} key={item}>
            <Card elevation={2}>
              <CardHeader title={<Skeleton width="40%" />} />
              <CardContent>
                <Skeleton variant="rectangular" height={300} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={4} sx={{ p: 2 }}>
      {/* Sales Timeline */}
      <Grid item xs={12} md={12} lg={8}>
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
            sx={{ pb: 0.5, pt: 2, px: 3 }}
            title="Sales Timeline"
            titleTypographyProps={{ 
              variant: 'h6', 
              fontWeight: 600,
              sx: {
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
          />
          <CardContent sx={{ px: 3, py: 2 }}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#667eea" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <Tooltip content={<CurrencyTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#667eea"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  filter="url(#shadow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Region Distribution */}
      <Grid item xs={12} md={6} lg={4}>
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
            sx={{ pb: 0.5, pt: 2, px: 3 }}
            title="Revenue by Region"
            titleTypographyProps={{ 
              variant: 'h6', 
              fontWeight: 600,
              sx: {
                background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
          />
          <CardContent sx={{ px: 3, py: 2 }}>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <defs>
                  <filter id="pieShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.1"/>
                  </filter>
                </defs>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="revenue"
                  label={({ region, percent }) => 
                    `${region} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  fontSize={11}
                  filter="url(#pieShadow)"
                >
                  {regionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CurrencyTooltip />}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Products */}
      <Grid item xs={12} md={12} lg={8}>
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
            sx={{ pb: 0.5, pt: 2, px: 3 }}
            title="Top Products by Revenue"
            titleTypographyProps={{ 
              variant: 'h6', 
              fontWeight: 600,
              sx: {
                background: 'linear-gradient(45deg, #fa709a 30%, #fee140 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
          />
          <CardContent sx={{ px: 3, py: 2 }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={productsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fa709a" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#fee140" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  angle={-90}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <Tooltip content={<CurrencyTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Sales vs Revenue Comparison */}
      <Grid item xs={12} md={6} lg={4}>
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
            sx={{ pb: 0.5, pt: 2, px: 3 }}
            title="Sales Volume vs Revenue"
            titleTypographyProps={{ 
              variant: 'h6', 
              fontWeight: 600,
              sx: {
                background: 'linear-gradient(45deg, #a8edea 30%, #fed6e3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
          />
          <CardContent sx={{ px: 3, py: 2 }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timelineData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="sales"
                  orientation="left"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="right"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  yAxisId="sales"
                  type="monotone"
                  dataKey="salesCount"
                  stroke="#fa709a"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#fa709a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#fa709a' }}
                  name="Sales Count"
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#a8edea"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#a8edea', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#a8edea' }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Charts;