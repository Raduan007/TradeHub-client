import dns from "node:dns/promises";
import { MongoClient, ServerApiVersion } from "mongodb";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = process.env.MONGO_DB_URI || process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || process.env.DB_NAME || "tradehubdb";

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

export async function getDb() {
  if (!uri) {
    throw new Error("Missing MONGO_DB_URI environment variable");
  }

  if (!globalForMongo._mongoClientPromise) {
    const client = createClient();
    globalForMongo._mongoClientPromise = client.connect();
  }

  const client = await globalForMongo._mongoClientPromise;
  return client.db(dbName);
}
