const { Sale, Customer, Product, AnalyticsReport } = require('../models');

const getDashboardOverview = async (req, res) => {
  try {
    const { startDate, endDate, region, category } = req.validatedQuery;
    
    // Build match criteria
    const matchCriteria = {
      saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: 'completed'
    };
    
    if (region) matchCriteria.region = region;

    // Main aggregation pipeline
    const overview = await Sale.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      ...(category ? [{ $match: { 'product.category': category } }] : []),
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalSales: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const result = overview[0] || { totalRevenue: 0, totalSales: 0, avgOrderValue: 0 };
    
    res.json({
      success: true,
      data: {
        totalRevenue: result.totalRevenue,
        totalSales: result.totalSales,
        avgOrderValue: Math.round(result.avgOrderValue * 100) / 100
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, region, category, limit } = req.validatedQuery;
    
    const matchCriteria = {
      saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: 'completed'
    };
    
    if (region) matchCriteria.region = region;

    const topProducts = await Sale.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      ...(category ? [{ $match: { 'product.category': category } }] : []),
      {
        $group: {
          _id: '$productId',
          name: { $first: '$product.name' },
          category: { $first: '$product.category' },
          totalSales: { $sum: '$quantity' },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit }
    ]);

    res.json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
};

const getTopCustomers = async (req, res) => {
  try {
    const { startDate, endDate, region, limit } = req.validatedQuery;
    
    const matchCriteria = {
      saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: 'completed'
    };
    
    if (region) matchCriteria.region = region;

    const topCustomers = await Sale.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $group: {
          _id: '$customerId',
          name: { $first: '$customer.name' },
          customerType: { $first: '$customer.customerType' },
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit }
    ]);

    res.json({
      success: true,
      data: topCustomers
    });
  } catch (error) {
    console.error('Top customers error:', error);
    res.status(500).json({ error: 'Failed to fetch top customers' });
  }
};

const getRegionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.validatedQuery;
    
    const regionStats = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$region',
          revenue: { $sum: '$totalAmount' },
          salesCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $project: {
          region: '$_id',
          revenue: 1,
          salesCount: 1,
          avgOrderValue: { $round: ['$avgOrderValue', 2] },
          _id: 0
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: regionStats
    });
  } catch (error) {
    console.error('Region stats error:', error);
    res.status(500).json({ error: 'Failed to fetch region statistics' });
  }
};

const getSalesTimeline = async (req, res) => {
  try {
    const { startDate, endDate, region } = req.validatedQuery;
    
    const matchCriteria = {
      saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: 'completed'
    };
    
    if (region) matchCriteria.region = region;

    const salesTimeline = await Sale.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: {
            year: { $year: '$saleDate' },
            month: { $month: '$saleDate' },
            day: { $dayOfMonth: '$saleDate' }
          },
          revenue: { $sum: '$totalAmount' },
          salesCount: { $sum: 1 }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          revenue: 1,
          salesCount: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: salesTimeline
    });
  } catch (error) {
    console.error('Sales timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch sales timeline' });
  }
};

const generateAndSaveReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.validatedQuery;
    
    // Get all analytics data
    const [overview, topProducts, topCustomers, regionStats, salesTimeline] = await Promise.all([
      Sale.aggregate([
        {
          $match: {
            saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalSales: { $sum: 1 },
            avgOrderValue: { $avg: '$totalAmount' }
          }
        }
      ]),
      
      Sale.aggregate([
        {
          $match: {
            saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
            status: 'completed'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$productId',
            name: { $first: '$product.name' },
            totalSales: { $sum: '$quantity' },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 }
      ]),
      
      // Add other aggregations as needed...
    ]);

    const reportData = {
      dateRange: { startDate: new Date(startDate), endDate: new Date(endDate) },
      ...overview[0],
      topProducts: topProducts || [],
      topCustomers: topCustomers || [],
      regionStats: regionStats || [],
      salesByDate: salesTimeline || []
    };

    const savedReport = await AnalyticsReport.create(reportData);

    res.json({
      success: true,
      message: 'Report generated and saved successfully',
      reportId: savedReport._id
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

module.exports = {
  getDashboardOverview,
  getTopProducts,
  getTopCustomers,
  getRegionStats,
  getSalesTimeline,
  generateAndSaveReport
};