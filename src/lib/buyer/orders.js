import { ObjectId } from "mongodb";

import {
  BUYER_COLLECTIONS,
  DEFAULT_PAGE_SIZE,
} from "@/lib/constants/buyer";
import { getDb } from "@/lib/mongodb";
import { serializeDocument, serializeDocuments } from "@/lib/serialize";

function buildOrderSearchFilter(buyerId, search) {
  const filter = { buyerId };

  if (search?.trim()) {
    const term = search.trim();
    filter.$or = [
      { orderNumber: { $regex: term, $options: "i" } },
      { productTitle: { $regex: term, $options: "i" } },
    ];
  }

  return filter;
}

export async function getBuyerOrders(buyerId, { search = "", page = 1, limit = DEFAULT_PAGE_SIZE } = {}) {
  const db = await getDb();
  const collection = db.collection(BUYER_COLLECTIONS.ORDERS);
  const filter = buildOrderSearchFilter(buyerId, search);
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || DEFAULT_PAGE_SIZE));
  const skip = (safePage - 1) * safeLimit;

  const [orders, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    orders: serializeDocuments(orders),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function getBuyerOrderById(buyerId, orderId) {
  if (!ObjectId.isValid(orderId)) {
    return null;
  }

  const db = await getDb();
  const order = await db.collection(BUYER_COLLECTIONS.ORDERS).findOne({
    _id: new ObjectId(orderId),
    buyerId,
  });

  return serializeDocument(order);
}

export async function getBuyerOrderCount(buyerId) {
  const db = await getDb();
  return db.collection(BUYER_COLLECTIONS.ORDERS).countDocuments({ buyerId });
}

export async function getBuyerRecentOrders(buyerId, limit = 5) {
  const db = await getDb();
  const orders = await db
    .collection(BUYER_COLLECTIONS.ORDERS)
    .find({ buyerId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return serializeDocuments(orders);
}

export async function cancelBuyerOrder(buyerId, orderId) {
  if (!ObjectId.isValid(orderId)) {
    return null;
  }

  const db = await getDb();
  const order = await db.collection(BUYER_COLLECTIONS.ORDERS).findOne({
    _id: new ObjectId(orderId),
    buyerId,
  });

  if (!order) {
    return null;
  }

  if (!["pending", "processing"].includes(order.status)) {
    throw new Error("Only pending or processing orders can be cancelled");
  }

  const result = await db.collection(BUYER_COLLECTIONS.ORDERS).findOneAndUpdate(
    { _id: new ObjectId(orderId), buyerId },
    { $set: { status: "cancelled", updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return serializeDocument(result);
}
