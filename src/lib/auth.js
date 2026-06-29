import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";

import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import dns from "node:dns/promises";
import {
  ALLOWED_SIGNUP_ROLES,
  DEFAULT_USER_ROLE,
  DEFAULT_USER_STATUS,
} from "./user-roles";

// Only set custom DNS servers in local development environment if needed
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    // Ignore DNS override errors
  }
}

const uri = process.env.MONGO_DB_URI || process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || process.env.DB_NAME || "tradehubdb";

if (!uri) {
  throw new Error("Missing MONGO_DB_URI environment variable");
}

const client = new MongoClient(uri);
const db = client.db(dbName);

const dynamicVercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

const trustedOrigins = [
  "http://localhost:3000",
  "https://trade-hub-client-pi.vercel.app",
  "https://trade-hub-client-nine.vercel.app",
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  dynamicVercelUrl,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((origin) => origin.trim()) ||
    []),
].filter((origin, index, list) => origin && list.indexOf(origin) === index);

function getBaseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  if (dynamicVercelUrl) return dynamicVercelUrl;
  return "http://localhost:3000";
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: getBaseURL(),
  trustedOrigins,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
  type: "string",
  required: false,
  defaultValue: DEFAULT_USER_ROLE,
  input: false,
},
      status: {
        type: "string",
        required: false,
        defaultValue: DEFAULT_USER_STATUS,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const requestedRole = ctx?.body?.role;
          let role = DEFAULT_USER_ROLE;

          if (requestedRole) {
            if (!ALLOWED_SIGNUP_ROLES.includes(requestedRole)) {
              throw new APIError("BAD_REQUEST", {
                message:
                  "Invalid role selected. Only buyer or seller is allowed.",
              });
            }

            role = requestedRole;
          }

          return {
            data: {
              ...user,
              role,
              status: DEFAULT_USER_STATUS,
            },
          };
        },
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
