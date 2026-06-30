import dns from "node:dns/promises";
import { MongoClient, ServerApiVersion } from "mongodb";

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    // Ignore DNS override errors in production/vercel
  }
}

const uri = process.env.MONGO_DB_URI || process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || process.env.DB_NAME || "tradehubdb";
const productsDbName = process.env.PRODUCTS_DB_NAME || "tradehubdb";

const globalForMongo = globalThis;

function createClient() {
  return new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

async function getClient() {
  if (!uri) {
    throw new Error("Missing MONGO_DB_URI environment variable");
  }

  if (!globalForMongo._mongoClientPromise) {
    const client = createClient();
    globalForMongo._mongoClientPromise = client.connect();
  }

  return globalForMongo._mongoClientPromise;
}

export async function getDb() {
  const client = await getClient();
  return client.db(dbName);
}

export async function getProductsDb() {
  const client = await getClient();
  return client.db(productsDbName);
}
