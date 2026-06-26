import { getDb } from "@/lib/mongodb";
import { SELLER_COLLECTIONS } from "@/lib/constants/seller";
import { serializeDocument, serializeDocuments } from "@/lib/serialize";

const DEFAULT_SETTINGS = {
  storeName: "",
  notifyOrders: true,
  notifyMessages: true,
  autoAcceptOrders: false,
};

export async function getSellerSettings(sellerId) {
  const db = await getDb();
  const settings = await db
    .collection(SELLER_COLLECTIONS.SETTINGS)
    .findOne({ sellerId });

  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    sellerId,
  };
}

export async function updateSellerSettings(sellerId, updates) {
  const db = await getDb();
  const allowed = {};

  if (typeof updates.storeName === "string") {
    allowed.storeName = updates.storeName.trim();
  }

  if (typeof updates.notifyOrders === "boolean") {
    allowed.notifyOrders = updates.notifyOrders;
  }

  if (typeof updates.notifyMessages === "boolean") {
    allowed.notifyMessages = updates.notifyMessages;
  }

  if (typeof updates.autoAcceptOrders === "boolean") {
    allowed.autoAcceptOrders = updates.autoAcceptOrders;
  }

  if (Object.keys(allowed).length === 0) {
    throw new Error("No valid settings to update");
  }

  const result = await db.collection(SELLER_COLLECTIONS.SETTINGS).findOneAndUpdate(
    { sellerId },
    {
      $set: { ...allowed, updatedAt: new Date() },
      $setOnInsert: { sellerId, createdAt: new Date() },
    },
    { upsert: true, returnDocument: "after" }
  );

  return {
    ...DEFAULT_SETTINGS,
    ...serializeDocument(result),
    sellerId,
  };
}

export async function getSellerMessages(sellerId) {
  const db = await getDb();
  const messages = await db
    .collection(SELLER_COLLECTIONS.MESSAGES)
    .find({ sellerId })
    .sort({ createdAt: -1 })
    .toArray();

  return serializeDocuments(messages);
}

export async function createSellerMessage(sellerId, payload) {
  const db = await getDb();
  const now = new Date();
  const message = {
    sellerId,
    buyerId: payload.buyerId || "",
    buyerName: payload.buyerName?.trim() || "Buyer",
    subject: payload.subject?.trim() || "Message",
    body: payload.body?.trim() || "",
    direction: payload.direction || "outbound",
    read: false,
    createdAt: now,
    updatedAt: now,
  };

  if (!message.body) {
    throw new Error("Message body is required");
  }

  const result = await db
    .collection(SELLER_COLLECTIONS.MESSAGES)
    .insertOne(message);

  return serializeDocument({ _id: result.insertedId, ...message });
}

export async function markSellerMessageRead(sellerId, messageId) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");

  if (!ObjectId.isValid(messageId)) {
    return null;
  }

  const result = await db.collection(SELLER_COLLECTIONS.MESSAGES).findOneAndUpdate(
    { _id: new ObjectId(messageId), sellerId },
    { $set: { read: true, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return serializeDocument(result);
}

export async function getSellerUnreadMessageCount(sellerId) {
  const db = await getDb();
  return db.collection(SELLER_COLLECTIONS.MESSAGES).countDocuments({
    sellerId,
    read: false,
    direction: "inbound",
  });
}
