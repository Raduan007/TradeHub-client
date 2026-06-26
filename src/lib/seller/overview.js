import { fetchProducts } from "@/lib/products";
import { getSellerOrderCount, getSellerPendingOrderCount, getSellerRecentOrders, getSellerTotalRevenue } from "@/lib/seller/orders";

export async function getSellerOverview(sellerId) {
  const [listings, totalOrders, pendingOrders, totalRevenue, recentOrders] =
    await Promise.all([
      fetchProducts({ sellerId, limit: 100 }),
      getSellerOrderCount(sellerId),
      getSellerPendingOrderCount(sellerId),
      getSellerTotalRevenue(sellerId),
      getSellerRecentOrders(sellerId, 5),
    ]);

  return {
    activeListings: listings.length,
    totalOrders,
    pendingOrders,
    totalRevenue,
    recentOrders,
  };
}
