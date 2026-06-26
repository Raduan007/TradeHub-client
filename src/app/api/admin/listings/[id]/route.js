import { deleteProduct, updateProduct } from "@/lib/products";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function PATCH(request, { params }) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;

    const { id } = await params;
    const body = await request.json();
    const listing = await updateProduct(id, body);
    return jsonOk({ listing });
  } catch (error) {
    return jsonError(error.message || "Failed to update listing", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;

    const { id } = await params;
    await deleteProduct(id);
    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error.message || "Failed to delete listing", 500);
  }
}
