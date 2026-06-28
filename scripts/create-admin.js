/**
 * Creates an admin user for TradeHub (email/password login).
 *
 * Usage:
 *   node scripts/create-admin.js
 *   node scripts/create-admin.js --email you@example.com --password "YourPass1" --name "Admin Name"
 *
 * Optional .env overrides:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */

import { MongoClient, ObjectId } from "mongodb";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import dns from "node:dns/promises";
import { hashPassword } from "better-auth/crypto";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

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
      const value = trimmed
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, "");

      process.env[key] = value;
    }
  } catch {
    // .env is optional if variables are already exported
  }
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--email") {
      args.email = argv[index + 1];
      index += 1;
    } else if (token === "--password") {
      args.password = argv[index + 1];
      index += 1;
    } else if (token === "--name") {
      args.name = argv[index + 1];
      index += 1;
    }
  }

  return args;
}

function getUserIdMatchers(userId) {
  const matchers = [userId];

  if (userId instanceof ObjectId) {
    matchers.push(userId.toString());
  } else if (typeof userId === "string" && ObjectId.isValid(userId)) {
    matchers.push(new ObjectId(userId));
  }

  return matchers;
}

async function verifyCredentialAccount(db, userId) {
  const accounts = db.collection("account");
  const credentialAccount = await accounts.findOne({
    providerId: "credential",
    userId: { $in: getUserIdMatchers(userId) },
  });

  if (!credentialAccount?.password) {
    throw new Error("Credential account was not created correctly.");
  }

  const joinedAccounts = await db
    .collection("user")
    .aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "account",
          localField: "_id",
          foreignField: "userId",
          as: "account",
        },
      },
      { $limit: 1 },
    ])
    .toArray();

  const linkedAccount = joinedAccounts[0]?.account?.find(
    (account) => account.providerId === "credential"
  );

  if (!linkedAccount) {
    throw new Error(
      "Better Auth cannot link the admin account. Check account.userId type matches user._id."
    );
  }
}

loadEnvFile();

const cliArgs = parseArgs(process.argv.slice(2));
const email = (
  cliArgs.email ||
  process.env.ADMIN_EMAIL ||
  "admin@tradehub.com"
).toLowerCase();
const password = cliArgs.password || process.env.ADMIN_PASSWORD || "Admin@12345";
const name = cliArgs.name || process.env.ADMIN_NAME || "TradeHub Admin";

const uri = process.env.MONGO_DB_URI || process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || process.env.DB_NAME || "tradehubdb";

if (!uri) {
  console.error("Missing MONGO_DB_URI in .env");
  process.exit(1);
}

async function createAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("user");
    const accounts = db.collection("account");

    const existingUser = await users.findOne({
      email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (existingUser) {
      await accounts.deleteMany({
        userId: { $in: getUserIdMatchers(existingUser._id) },
      });
      await users.deleteOne({ _id: existingUser._id });
      console.log(`Removed existing admin records for ${email}`);
    }

    const userId = new ObjectId();
    const now = new Date();
    const hashedPassword = await hashPassword(password);
    const userIdString = userId.toString();

    await users.insertOne({
      _id: userId,
      name,
      email,
      emailVerified: true,
      image: null,
      role: "admin",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    await accounts.insertOne({
      userId,
      providerId: "credential",
      accountId: userIdString,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    await verifyCredentialAccount(db, userId);

    console.log("Admin user created successfully:");
    console.log(`  Database: ${dbName}`);
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Login:    http://localhost:3000/login`);
    console.log(`  Dashboard: http://localhost:3000/dashboard/admin`);
    console.log(`  Production login: https://trade-hub-client-pi.vercel.app/login`);
  } finally {
    await client.close();
  }
}

createAdmin().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
});
