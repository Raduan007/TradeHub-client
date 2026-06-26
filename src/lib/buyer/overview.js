import { getBuyerOrderCount, getBuyerRecentOrders } from "@/lib/buyer/orders";
import { getBuyerTotalPayments } from "@/lib/buyer/payments";
import { getBuyerWishlistCount } from "@/lib/buyer/wishlist";

export async function getBuyerOverview(buyerId) {
  const [totalOrders, wishlistItems, totalPayments, recentOrders] =
    await Promise.all([
      getBuyerOrderCount(buyerId),
      getBuyerWishlistCount(buyerId),
      getBuyerTotalPayments(buyerId),
      getBuyerRecentOrders(buyerId, 5),
    ]);

  return {
    totalOrders,
    wishlistItems,
    totalPayments,
    recentOrders,
  };
}
