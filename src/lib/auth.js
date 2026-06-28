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

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

const trustedOrigins = [
  "http://localhost:3000",
  "https://trade-hub-client-pi.vercel.app",
  "https://trade-hub-client-nine.vercel.app",
  process.env.BETTER_AUTH_URL,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((origin) => origin.trim()) ||
    []),
].filter((origin, index, list) => origin && list.indexOf(origin) === index);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
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
