import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/products";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const listings = await fetchProducts({
      sellerId: authResult.sellerId,
      limit: 100,
      search,
    });

    return jsonOk({ listings });
  } catch (error) {
    console.error("GET /api/seller/listings failed:", error);
    return jsonError("Failed to load listings", 500);
  }
}

export async function POST(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();

    if (!body?.name?.trim()) {
      return jsonError("Product name is required", 400);
    }

    const listing = await createProduct({
      ...body,
      sellerId: authResult.sellerId,
      status: body.status || "active",
    });

    return jsonOk({ listing }, 201);
  } catch (error) {
    console.error("POST /api/seller/listings failed:", error);
    return jsonError(error.message || "Failed to create listing", 500);
  }
}
