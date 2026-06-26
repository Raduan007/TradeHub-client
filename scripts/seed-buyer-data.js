/**
 * Seeds sample buyer dashboard data for a given user ID.
 *
 * Usage:
 *   node scripts/seed-buyer-data.js <buyerUserId>
 *
 * Requires MONGO_DB_URI and AUTH_DB_NAME in .env
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

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env is optional if variables are already exported
  }
}

loadEnvFile();

const buyerId = process.argv[2];

if (!buyerId) {
  console.error("Usage: node scripts/seed-buyer-data.js <buyerUserId>");
  process.exit(1);
}

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.AUTH_DB_NAME;

if (!uri || !dbName) {
  console.error("Missing MONGO_DB_URI or AUTH_DB_NAME");
  process.exit(1);
}

const now = new Date();

const sampleOrders = [
  {
    buyerId,
    orderNumber: "TH-10021",
    productId: "prod-001",
    productTitle: "Vintage Leather Jacket",
    productImage: "/images/products/product1.jpg",
    quantity: 1,
    amount: 129.99,
    status: "delivered",
    shippingAddress: "123 Market Street, Austin, TX",
    notes: "Leave at front desk",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: now,
  },
  {
    buyerId,
    orderNumber: "TH-10022",
    productId: "prod-002",
    productTitle: "Wireless Headphones",
    productImage: "/images/products/product2.jpg",
    quantity: 1,
    amount: 89.5,
    status: "shipped",
    shippingAddress: "123 Market Street, Austin, TX",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: now,
  },
  {
    buyerId,
    orderNumber: "TH-10023",
    productId: "prod-003",
    productTitle: "Minimal Desk Lamp",
    productImage: "/images/products/product3.jpg",
    quantity: 2,
    amount: 74,
    status: "processing",
    shippingAddress: "123 Market Street, Austin, TX",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 8),
    updatedAt: now,
  },
];

const sampleWishlist = [
  {
    buyerId,
    productId: "prod-004",
    productTitle: "Ceramic Plant Pot Set",
    productImage: "/images/products/product4.jpg",
    productPrice: 34.99,
    addedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1),
  },
  {
    buyerId,
    productId: "prod-005",
    productTitle: "Running Shoes",
    productImage: "/images/products/product5.jpg",
    productPrice: 119,
    addedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3),
  },
];

const samplePayments = [
  {
    buyerId,
    transactionId: "TXN-908172",
    orderNumber: "TH-10021",
    amount: 129.99,
    status: "completed",
    paymentMethod: "card",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    buyerId,
    transactionId: "TXN-908173",
    orderNumber: "TH-10022",
    amount: 89.5,
    status: "completed",
    paymentMethod: "card",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    buyerId,
    transactionId: "TXN-908174",
    orderNumber: "TH-10023",
    amount: 74,
    status: "pending",
    paymentMethod: "card",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 8),
  },
];

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    await db.collection("buyer_orders").deleteMany({ buyerId });
    await db.collection("buyer_wishlist").deleteMany({ buyerId });
    await db.collection("buyer_payments").deleteMany({ buyerId });

    await db.collection("buyer_orders").insertMany(sampleOrders);
    await db.collection("buyer_wishlist").insertMany(sampleWishlist);
    await db.collection("buyer_payments").insertMany(samplePayments);

    console.log(`Seeded buyer dashboard data for user ${buyerId}`);
  } finally {
    await client.close();
  }
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
