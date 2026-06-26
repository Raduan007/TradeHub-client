import { getDb } from "@/lib/mongodb";
import { BUYER_COLLECTIONS, PAYMENT_STATUSES } from "@/lib/constants/buyer";
import { serializeDocuments } from "@/lib/serialize";

export async function getBuyerPayments(buyerId) {
  const db = await getDb();
  const payments = await db
    .collection(BUYER_COLLECTIONS.PAYMENTS)
    .find({ buyerId })
    .sort({ createdAt: -1 })
    .toArray();

  return serializeDocuments(payments);
}

export async function getBuyerTotalPayments(buyerId) {
  const db = await getDb();
  const result = await db
    .collection(BUYER_COLLECTIONS.PAYMENTS)
    .aggregate([
      {
        $match: {
          buyerId,
          status: PAYMENT_STATUSES.COMPLETED,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])
    .toArray();

  return result[0]?.total ?? 0;
}
