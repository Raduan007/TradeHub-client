import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

function getAuthBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL;
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
        status: {
          type: "string",
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
