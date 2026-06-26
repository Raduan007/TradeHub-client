import { ObjectId } from "mongodb";

import { DEFAULT_PAGE_SIZE, ORDER_STATUSES } from "@/lib/constants/buyer";
import { SELLER_COLLECTIONS } from "@/lib/constants/seller";
import { getDb } from "@/lib/mongodb";
import { serializeDocument, serializeDocuments } from "@/lib/serialize";

function buildOrderSearchFilter(sellerId, search) {
  const filter = { sellerId };

  if (search?.trim()) {
    const term = search.trim();
    filter.$or = [
      { orderNumber: { $regex: term, $options: "i" } },
      { productTitle: { $regex: term, $options: "i" } },
      { buyerName: { $regex: term, $options: "i" } },
    ];
  }

  return filter;
}

export async function getSellerOrders(
  sellerId,
  { search = "", page = 1, limit = DEFAULT_PAGE_SIZE, status = "" } = {}
) {
  const db = await getDb();
  const collection = db.collection(SELLER_COLLECTIONS.ORDERS);
  const filter = buildOrderSearchFilter(sellerId, search);

  if (status) {
    filter.status = status;
  }

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

export async function getSellerOrderById(sellerId, orderId) {
  if (!ObjectId.isValid(orderId)) {
    return null;
  }

  const db = await getDb();
  const order = await db.collection(SELLER_COLLECTIONS.ORDERS).findOne({
    _id: new ObjectId(orderId),
    sellerId,
  });

  return serializeDocument(order);
}

export async function updateSellerOrderStatus(sellerId, orderId, status) {
  if (!Object.values(ORDER_STATUSES).includes(status)) {
    throw new Error("Invalid order status");
  }

  if (!ObjectId.isValid(orderId)) {
    return null;
  }

  const db = await getDb();
  const result = await db.collection(SELLER_COLLECTIONS.ORDERS).findOneAndUpdate(
    { _id: new ObjectId(orderId), sellerId },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return serializeDocument(result);
}

export async function getSellerOrderCount(sellerId) {
  const db = await getDb();
  return db.collection(SELLER_COLLECTIONS.ORDERS).countDocuments({ sellerId });
}

export async function getSellerPendingOrderCount(sellerId) {
  const db = await getDb();
  return db.collection(SELLER_COLLECTIONS.ORDERS).countDocuments({
    sellerId,
    status: { $in: [ORDER_STATUSES.PENDING, ORDER_STATUSES.PROCESSING] },
  });
}

export async function getSellerTotalRevenue(sellerId) {
  const db = await getDb();
  const result = await db
    .collection(SELLER_COLLECTIONS.ORDERS)
    .aggregate([
      {
        $match: {
          sellerId,
          status: { $ne: ORDER_STATUSES.CANCELLED },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
    .toArray();

  return result[0]?.total || 0;
}

export async function getSellerRecentOrders(sellerId, limit = 5) {
  const db = await getDb();
  const orders = await db
    .collection(SELLER_COLLECTIONS.ORDERS)
    .find({ sellerId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return serializeDocuments(orders);
}
