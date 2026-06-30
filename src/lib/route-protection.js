/**
 * Public routes — accessible without signing in.
 * Home, browse products, product details, marketing pages, and auth entry points.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/products",
  "/categories",
  "/category",
  "/about",
  "/contact",
  "/faq",
  "/auth/signin",
  "/auth/signup",
  "/login",
  "/register",
  "/access-denied",
];

/**
 * Private routes — require an authenticated session.
 * Dashboard covers profile, products, orders, wishlist, messages, and related flows.
 */
export const PROTECTED_ROUTE_PREFIXES = ["/dashboard"];

export const SIGN_IN_PATH = "/auth/signin";
export const SIGN_UP_PATH = "/auth/signup";

export function buildSignUpUrl(callbackPath, role = "buyer") {
  const params = new URLSearchParams();
  if (callbackPath) {
    params.set("callbackUrl", callbackPath);
  }
  if (role) {
    params.set("role", role);
  }
  const query = params.toString();
  return query ? `${SIGN_UP_PATH}?${query}` : SIGN_UP_PATH;
}

export function isProtectedPath(pathname) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isPublicPath(pathname) {
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return true;
  }

  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function buildSignInUrl(requestUrl, callbackPath) {
  const signInUrl = new URL(SIGN_IN_PATH, requestUrl);

  if (callbackPath) {
    signInUrl.searchParams.set("callbackUrl", callbackPath);
  }

  return signInUrl;
}
