/**
 * Seeds seller orders and admin reports for demo dashboards.
 *
 * Usage:
 *   node scripts/seed-platform-data.js <sellerUserId>
 */

import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const contents = readFileSync(envPath, "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {}
}

loadEnvFile();

const sellerId = process.argv[2];

if (!sellerId) {
  console.error("Usage: node scripts/seed-platform-data.js <sellerUserId>");
  process.exit(1);
}

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.AUTH_DB_NAME;

async function seed() {
  const client = new MongoClient(uri);
  const now = new Date();

  try {
    await client.connect();
    const db = client.db(dbName);

    await db.collection("seller_orders").deleteMany({ sellerId });
    await db.collection("admin_reports").deleteMany({});

    await db.collection("seller_orders").insertMany([
      {
        sellerId,
        buyerId: "demo-buyer-1",
        buyerName: "Md. Rakib Hasan",
        orderNumber: "TH-20001",
        productId: "prod-001",
        productTitle: "Used Dell Inspiron 15 Laptop",
        productImage: "/images/products/product1.jpg",
        quantity: 1,
        amount: 35000,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
      {
        sellerId,
        buyerId: "demo-buyer-2",
        buyerName: "Nusrat Jahan",
        orderNumber: "TH-20002",
        productId: "prod-002",
        productTitle: "Wireless Headphones",
        productImage: "/images/products/product2.jpg",
        quantity: 1,
        amount: 8950,
        status: "processing",
        createdAt: new Date(now.getTime() - 86400000 * 2),
        updatedAt: now,
      },
      {
        sellerId,
        buyerId: "demo-buyer-3",
        buyerName: "Karim Ahmed",
        orderNumber: "TH-20003",
        productId: "prod-003",
        productTitle: "Minimal Desk Lamp",
        productImage: "/images/products/product3.jpg",
        quantity: 1,
        amount: 2400,
        status: "delivered",
        createdAt: new Date(now.getTime() - 86400000 * 10),
        updatedAt: now,
      },
    ]);

    await db.collection("admin_reports").insertMany([
      {
        reporterName: "Md. Rakib Hasan",
        reporterId: "demo-buyer-1",
        targetType: "product",
        targetId: "prod-999",
        reason: "Misleading product description",
        status: "open",
        createdAt: now,
        updatedAt: now,
      },
      {
        reporterName: "Nusrat Jahan",
        reporterId: "demo-buyer-2",
        targetType: "product",
        targetId: "prod-888",
        reason: "Suspicious pricing",
        status: "open",
        createdAt: new Date(now.getTime() - 86400000),
        updatedAt: now,
      },
    ]);

    console.log("Seeded seller orders and admin reports.");
  } finally {
    await client.close();
  }
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
