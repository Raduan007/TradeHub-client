import { getDb } from "@/lib/mongodb";
import { BUYER_COLLECTIONS } from "@/lib/constants/buyer";
import { serializeDocuments } from "@/lib/serialize";

export async function getBuyerWishlist(buyerId) {
  const db = await getDb();
  const items = await db
    .collection(BUYER_COLLECTIONS.WISHLIST)
    .find({ buyerId })
    .sort({ addedAt: -1 })
    .toArray();

  return serializeDocuments(items);
}

export async function getBuyerWishlistCount(buyerId) {
  const db = await getDb();
  return db.collection(BUYER_COLLECTIONS.WISHLIST).countDocuments({ buyerId });
}

export async function removeWishlistItem(buyerId, productId) {
  const db = await getDb();
  const result = await db.collection(BUYER_COLLECTIONS.WISHLIST).deleteOne({
    buyerId,
    productId,
  });

  return result.deletedCount > 0;
}
