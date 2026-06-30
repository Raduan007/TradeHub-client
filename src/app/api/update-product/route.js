// src/app/api/update-product/route.js
import { getDb } from "@/lib/mongodb";
import { fetchProductById, updateProduct } from "@/lib/products";

/**
 * PATCH /api/update-product
 * Body: { productId: string, updates: object }
 * Updates the specified fields of a product.
 */
export async function PATCH(request) {
  try {
    const { productId, updates } = await request.json();
    if (!productId) {
      return new Response(JSON.stringify({ error: "productId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ error: "No updates provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify product exists
    const existing = await fetchProductById(productId);
    if (!existing) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Apply updates
    await updateProduct(productId, updates);
    const updated = await fetchProductById(productId);
    return new Response(JSON.stringify({ success: true, product: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Update product error", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
