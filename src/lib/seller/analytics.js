import { ORDER_STATUSES } from "@/lib/constants/buyer";
import { SELLER_COLLECTIONS } from "@/lib/constants/seller";
import { getDb } from "@/lib/mongodb";

export async function getSellerAnalytics(sellerId) {
  const db = await getDb();
  const ordersCollection = db.collection(SELLER_COLLECTIONS.ORDERS);

  const [statusBreakdown, monthlyRevenue, topProducts] = await Promise.all([
    ordersCollection
      .aggregate([
        { $match: { sellerId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray(),
    ordersCollection
      .aggregate([
        {
          $match: {
            sellerId,
            status: { $ne: ORDER_STATUSES.CANCELLED },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$amount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 6 },
      ])
      .toArray(),
    ordersCollection
      .aggregate([
        {
          $match: {
            sellerId,
            status: { $ne: ORDER_STATUSES.CANCELLED },
          },
        },
        {
          $group: {
            _id: "$productTitle",
            revenue: { $sum: "$amount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
      ])
      .toArray(),
  ]);

  const statusCounts = Object.values(ORDER_STATUSES).reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  statusBreakdown.forEach((item) => {
    statusCounts[item._id] = item.count;
  });

  return {
    statusCounts,
    monthlyRevenue: monthlyRevenue.map((item) => ({
      label: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      revenue: item.revenue,
      orders: item.orders,
    })),
    topProducts: topProducts.map((item) => ({
      productTitle: item._id,
      revenue: item.revenue,
      orders: item.orders,
    })),
  };
}
