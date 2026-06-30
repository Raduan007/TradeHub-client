// src/app/api/checkout/session/route.js
// This endpoint is no longer used after removing Stripe integration.
// It now simply returns a 404 response for any request.
export async function GET(request) {
  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
