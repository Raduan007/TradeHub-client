import dns from "node:dns/promises";
import { MongoClient } from "mongodb";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.AUTH_DB_NAME;

if (!uri) {
  throw new Error("Missing MONGO_DB_URI environment variable");
}

if (!dbName) {
  throw new Error("Missing AUTH_DB_NAME environment variable");
}

const globalForMongo = globalThis;

if (!globalForMongo._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalForMongo._mongoClientPromise = client.connect();
}

export async function getDb() {
  const client = await globalForMongo._mongoClientPromise;
  return client.db(dbName);
}