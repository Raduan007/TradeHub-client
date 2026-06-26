import { deleteProduct, fetchProductById, updateProduct } from "@/lib/products";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

async function getOwnedListing(sellerId, productId) {
  const listing = await fetchProductById(productId);

  if (!listing) {
    return null;
  }

  if (listing.sellerId && listing.sellerId !== sellerId) {
    return "forbidden";
  }

  return listing;
}

export async function GET(request, { params }) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { id } = await params;
    const listing = await getOwnedListing(authResult.sellerId, id);

    if (listing === "forbidden") {
      return jsonError("Forbidden", 403);
    }

    if (!listing) {
      return jsonError("Listing not found", 404);
    }

    return jsonOk({ listing });
  } catch (error) {
    console.error("GET /api/seller/listings/[id] failed:", error);
    return jsonError("Failed to load listing", 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { id } = await params;
    const listing = await getOwnedListing(authResult.sellerId, id);

    if (listing === "forbidden") {
      return jsonError("Forbidden", 403);
    }

    if (!listing) {
      return jsonError("Listing not found", 404);
    }

    const body = await request.json();
    const updated = await updateProduct(id, body);
    return jsonOk({ listing: updated });
  } catch (error) {
    console.error("PATCH /api/seller/listings/[id] failed:", error);
    return jsonError(error.message || "Failed to update listing", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { id } = await params;
    const listing = await getOwnedListing(authResult.sellerId, id);

    if (listing === "forbidden") {
      return jsonError("Forbidden", 403);
    }

    if (!listing) {
      return jsonError("Listing not found", 404);
    }

    await deleteProduct(id);
    return jsonOk({ success: true });
  } catch (error) {
    console.error("DELETE /api/seller/listings/[id] failed:", error);
    return jsonError(error.message || "Failed to delete listing", 500);
  }
}
