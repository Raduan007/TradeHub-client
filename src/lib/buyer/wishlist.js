import { getDb } from "@/lib/mongodb";
import { BUYER_COLLECTIONS } from "@/lib/constants/buyer";
import { serializeDocument, serializeDocuments } from "@/lib/serialize";

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

export async function addWishlistItem(buyerId, item) {
  const db = await getDb();
  const now = new Date();
  const existing = await db.collection(BUYER_COLLECTIONS.WISHLIST).findOne({
    buyerId,
    productId: item.productId,
  });

  if (existing) {
    return serializeDocument(existing);
  }

  const wishlistItem = {
    buyerId,
    productId: item.productId,
    productTitle: item.productTitle,
    productImage: item.productImage || "",
    productPrice: Number(item.productPrice) || 0,
    addedAt: now,
  };

  const result = await db.collection(BUYER_COLLECTIONS.WISHLIST).insertOne(wishlistItem);
  return serializeDocument({ _id: result.insertedId, ...wishlistItem });
}
