import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import dns from "node:dns/promises";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

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
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {}
}

loadEnvFile();

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.AUTH_DB_NAME;

async function check() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = await db.collection("user").find().toArray();
    console.log("All users in DB:");
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });
  } finally {
    await client.close();
  }
}

check().catch(console.error);
