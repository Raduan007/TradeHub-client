// src/app/api/create-checkout-session/route.js
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

/**
 * POST /api/create-checkout-session
 * Body: { priceId: string }
 * Returns: { url: string } – Stripe Checkout URL
 */
export async function POST(request) {
  try {
    const { priceId } = await request.json();
    if (!priceId) {
      return new Response(JSON.stringify({ error: "priceId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Determine success and cancel URLs using the request origin
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    const successUrl = `${origin}/checkout?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout?canceled=true`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
