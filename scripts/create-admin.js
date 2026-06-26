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

      if (!process.env[key]) {
        process.env[key] = value;
      }
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

loadEnvFile();

const cliArgs = parseArgs(process.argv.slice(2));
const email = (
  cliArgs.email ||
  process.env.ADMIN_EMAIL ||
  "admin@tradehub.com"
).toLowerCase();
const password = cliArgs.password || process.env.ADMIN_PASSWORD || "Admin@12345";
const name = cliArgs.name || process.env.ADMIN_NAME || "TradeHub Admin";

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.AUTH_DB_NAME;

if (!uri || !dbName) {
  console.error("Missing MONGO_DB_URI or AUTH_DB_NAME in .env");
  process.exit(1);
}

async function createAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("user");
    const accounts = db.collection("account");

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      await users.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            role: "admin",
            status: "active",
            updatedAt: new Date(),
          },
        }
      );

      const existingAccount = await accounts.findOne({
        userId: existingUser._id,
        providerId: "credential",
      });

      if (existingAccount) {
        const hashedPassword = await hashPassword(password);
        await accounts.updateOne(
          { _id: existingAccount._id },
          {
            $set: {
              password: hashedPassword,
              updatedAt: new Date(),
            },
          }
        );
      } else {
        const userId = existingUser._id.toString();
        const now = new Date();
        const hashedPassword = await hashPassword(password);

        await accounts.insertOne({
          userId: existingUser._id,
          providerId: "credential",
          accountId: userId,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        });
      }

      console.log("Updated existing user to admin:");
      console.log(`  Email:    ${email}`);
      console.log(`  Password: ${password}`);
      console.log(`  Login:    http://localhost:3000/auth/signin`);
      return;
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

    console.log("Admin user created:");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Login:    http://localhost:3000/auth/signin`);
    console.log(`  Dashboard: http://localhost:3000/dashboard/admin`);
  } finally {
    await client.close();
  }
}

createAdmin().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
});
