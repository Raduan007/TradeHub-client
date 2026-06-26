import { fetchProducts } from "@/lib/products";
import { ADMIN_COLLECTIONS, REPORT_STATUSES } from "@/lib/constants/admin";
import { BUYER_COLLECTIONS } from "@/lib/constants/buyer";
import { SELLER_COLLECTIONS } from "@/lib/constants/seller";
import { USER_ROLES } from "@/lib/user-roles";
import { getDb } from "@/lib/mongodb";
import { serializeDocument, serializeDocuments } from "@/lib/serialize";

export async function getAdminOverview() {
  const db = await getDb();

  const [totalUsers, buyers, sellers, admins, openReports, totalOrders, listings] =
    await Promise.all([
      db.collection("user").countDocuments(),
      db.collection("user").countDocuments({ role: USER_ROLES.BUYER }),
      db.collection("user").countDocuments({ role: USER_ROLES.SELLER }),
      db.collection("user").countDocuments({ role: USER_ROLES.ADMIN }),
      db
        .collection(ADMIN_COLLECTIONS.REPORTS)
        .countDocuments({ status: REPORT_STATUSES.OPEN }),
      db.collection(BUYER_COLLECTIONS.ORDERS).countDocuments(),
      fetchProducts({ limit: 100 }),
    ]);

  return {
    totalUsers,
    buyers,
    sellers,
    admins,
    openReports,
    totalOrders,
    activeListings: listings.length,
  };
}

export async function getAdminUsers({ search = "", page = 1, limit = 10, role = "" } = {}) {
  const db = await getDb();
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (search?.trim()) {
    const term = search.trim();
    filter.$or = [
      { name: { $regex: term, $options: "i" } },
      { email: { $regex: term, $options: "i" } },
    ];
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;

  const [users, total] = await Promise.all([
    db
      .collection("user")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .toArray(),
    db.collection("user").countDocuments(filter),
  ]);

  return {
    users: serializeDocuments(users).map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || USER_ROLES.BUYER,
      status: user.status || "active",
      image: user.image || "",
      createdAt: user.createdAt,
    })),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function updateAdminUser(userId, updates) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  const allowed = {};

  if (updates.role && Object.values(USER_ROLES).includes(updates.role)) {
    allowed.role = updates.role;
  }

  if (updates.status && ["active", "suspended", "banned"].includes(updates.status)) {
    allowed.status = updates.status;
  }

  if (Object.keys(allowed).length === 0) {
    throw new Error("No valid fields to update");
  }

  const filter = ObjectId.isValid(userId)
    ? { _id: new ObjectId(userId) }
    : { _id: userId };

  const result = await db.collection("user").findOneAndUpdate(
    filter,
    { $set: { ...allowed, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!result) {
    return null;
  }

  const user = serializeDocument(result);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || USER_ROLES.BUYER,
    status: user.status || "active",
    image: user.image || "",
    createdAt: user.createdAt,
  };
}

export async function getAdminReports({ status = "", page = 1, limit = 10 } = {}) {
  const db = await getDb();
  const filter = {};

  if (status) {
    filter.status = status;
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;

  const [reports, total] = await Promise.all([
    db
      .collection(ADMIN_COLLECTIONS.REPORTS)
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .toArray(),
    db.collection(ADMIN_COLLECTIONS.REPORTS).countDocuments(filter),
  ]);

  return {
    reports: serializeDocuments(reports),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function updateAdminReport(reportId, status) {
  if (!Object.values(REPORT_STATUSES).includes(status)) {
    throw new Error("Invalid report status");
  }

  const db = await getDb();
  const { ObjectId } = await import("mongodb");

  if (!ObjectId.isValid(reportId)) {
    return null;
  }

  const result = await db.collection(ADMIN_COLLECTIONS.REPORTS).findOneAndUpdate(
    { _id: new ObjectId(reportId) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return serializeDocument(result);
}

const DEFAULT_PLATFORM_SETTINGS = {
  siteName: "TradeHub",
  supportEmail: "support@tradehub.com",
  maintenanceMode: false,
  allowRegistration: true,
  commissionRate: 5,
};

export async function getPlatformSettings() {
  const db = await getDb();
  const settings = await db
    .collection(ADMIN_COLLECTIONS.SETTINGS)
    .findOne({ key: "platform" });

  return {
    ...DEFAULT_PLATFORM_SETTINGS,
    ...settings?.values,
  };
}

export async function updatePlatformSettings(updates) {
  const db = await getDb();
  const allowed = {};

  if (typeof updates.siteName === "string") {
    allowed.siteName = updates.siteName.trim();
  }

  if (typeof updates.supportEmail === "string") {
    allowed.supportEmail = updates.supportEmail.trim();
  }

  if (typeof updates.maintenanceMode === "boolean") {
    allowed.maintenanceMode = updates.maintenanceMode;
  }

  if (typeof updates.allowRegistration === "boolean") {
    allowed.allowRegistration = updates.allowRegistration;
  }

  if (typeof updates.commissionRate === "number") {
    allowed.commissionRate = Math.min(100, Math.max(0, updates.commissionRate));
  }

  if (Object.keys(allowed).length === 0) {
    throw new Error("No valid settings to update");
  }

  const current = await getPlatformSettings();
  const values = { ...current, ...allowed };

  await db.collection(ADMIN_COLLECTIONS.SETTINGS).updateOne(
    { key: "platform" },
    {
      $set: { values, updatedAt: new Date() },
      $setOnInsert: { key: "platform", createdAt: new Date() },
    },
    { upsert: true }
  );

  return values;
}

export async function getAdminStatsSummary() {
  const db = await getDb();
  const recentReports = await db
    .collection(ADMIN_COLLECTIONS.REPORTS)
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  const recentSellerOrders = await db
    .collection(SELLER_COLLECTIONS.ORDERS)
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  return {
    recentReports: serializeDocuments(recentReports),
    recentSellerOrders: serializeDocuments(recentSellerOrders),
  };
}
