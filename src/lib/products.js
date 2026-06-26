import { serializeDocument, serializeDocuments } from "@/lib/serialize";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function normalizeProduct(product) {
  if (!product) {
    return null;
  }

  const serialized = serializeDocument(product);
  return {
    ...serialized,
    id: serialized.id || product._id?.toString(),
    title: product.name || product.title,
    name: product.name || product.title,
  };
}

export async function fetchProducts({ sellerId, limit = 24, search = "" } = {}) {
  const params = new URLSearchParams();

  if (limit) {
    params.set("limit", String(limit));
  }

  if (sellerId) {
    params.set("sellerId", sellerId);
  }

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const query = params.toString();
  const response = await fetch(
    `${API_URL}/api/products${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to fetch products");
  }

  const products = await response.json();
  return products.map(normalizeProduct);
}

export async function fetchProductById(productId) {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to fetch product");
  }

  const product = await response.json();
  return normalizeProduct(product);
}

export async function createProduct(productData) {
  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to create product");
  }

  return normalizeProduct(await response.json());
}

export async function updateProduct(productId, updates) {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to update product");
  }

  return normalizeProduct(await response.json());
}

export async function deleteProduct(productId) {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to delete product");
  }

  return true;
}

export function serializeProductList(products) {
  return serializeDocuments(products);
}
