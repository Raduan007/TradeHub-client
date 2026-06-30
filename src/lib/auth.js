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
  // Secret for signing JWTs and cookies
  secret: process.env.BETTER_AUTH_SECRET,
  // Base URL controls the OAuth callback URIs. In development it resolves to http://localhost:3000,
  // in production to the Vercel URL via BETTER_AUTH_URL env var.
  baseURL: getBaseURL(),
  trustedOrigins,
  // Configure the Google provider
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  // Enable email/password flow (unchanged)
  emailAndPassword: {
    enabled: true,
  },
  // Advanced cookie settings – secure defaults for production, lax for localhost.
  advanced: {
    cookieOptions: {
      httpOnly: true,
      // `secure` must be true for HTTPS (production) but false for localhost HTTP.
      secure: process.env.NODE_ENV === "production",
      // SameSite must be 'none' for cross‑site OAuth redirects in production (HTTPS).
      // For localhost we keep 'lax' to avoid requiring HTTPS.
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: DEFAULT_USER_ROLE,
        // Allow role to be set from request body or query
        input: true,
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
          let requestedRole = ctx?.body?.role || ctx?.query?.role;


          if (!requestedRole && ctx?.request?.url) {
            try {
              const url = new URL(ctx.request.url);
              requestedRole = url.searchParams.get("role");
            } catch (e) {
              // ignore url parsing error
            }
          }

          let role = DEFAULT_USER_ROLE;

          if (requestedRole && ALLOWED_SIGNUP_ROLES.includes(requestedRole)) {
            role = requestedRole;
          }


          return {
            ...user,
            role,
            status: DEFAULT_USER_STATUS,
          };
        },
      },
    },
  },
  // Attach MongoDB adapter for user storage
  database: mongodbAdapter(db, {
    client,
  }),
});