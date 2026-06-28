import { ObjectId } from "mongodb";

import { getDb } from "@/lib/mongodb";
import { serializeDocument, serializeDocuments } from "@/lib/serialize";

const PRODUCTS_COLLECTION = process.env.PRODUCTS_COLLECTION || "courses";

async function getProductsCollection() {
  const db = await getDb();
  return db.collection(PRODUCTS_COLLECTION);
}

function getProductFilter(id) {
  return ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
}

function buildProductFilter({ sellerId, search = "", category = "" } = {}) {
  const filter = {};

  if (sellerId) {
    filter.sellerId = sellerId;
  }

  if (category?.trim()) {
    filter.category = { $regex: category.trim(), $options: "i" };
  }

  if (search?.trim()) {
    const term = search.trim();
    filter.$or = [
      { name: { $regex: term, $options: "i" } },
      { category: { $regex: term, $options: "i" } },
      { brand: { $regex: term, $options: "i" } },
    ];
  }

  return filter;
}

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

async function findProducts({ sellerId, limit = 24, search = "", category = "" } = {}) {
  const collection = await getProductsCollection();
  const cappedLimit = Math.min(Number(limit) || 24, 100);

  return collection
    .find(buildProductFilter({ sellerId, search, category }))
    .sort({ createdAt: -1 })
    .limit(cappedLimit)
    .toArray();
}

export async function fetchProductsRaw({
  sellerId,
  limit = 24,
  search = "",
  category = "",
} = {}) {
  return findProducts({ sellerId, limit, search, category });
}

export async function fetchProductRaw(productId) {
  const collection = await getProductsCollection();
  return collection.findOne(getProductFilter(productId));
}

export async function fetchProducts({
  sellerId,
  limit = 24,
  search = "",
  category = "",
} = {}) {
  const products = await findProducts({ sellerId, limit, search, category });
  return products.map(normalizeProduct);
}

export async function fetchProductById(productId) {
  const product = await fetchProductRaw(productId);
  return normalizeProduct(product);
}

export async function createProduct(productData) {
  const collection = await getProductsCollection();
  const product = {
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(product);

  return normalizeProduct({ ...product, _id: result.insertedId });
}

export async function updateProduct(productId, updates) {
  const collection = await getProductsCollection();
  const { _id, createdAt, ...safeUpdates } = updates;
  const result = await collection.findOneAndUpdate(
    getProductFilter(productId),
    {
      $set: {
        ...safeUpdates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new Error("Product not found");
  }

  return normalizeProduct(result);
}

export async function deleteProduct(productId) {
  const collection = await getProductsCollection();
  const result = await collection.deleteOne(getProductFilter(productId));

  if (result.deletedCount === 0) {
    throw new Error("Product not found");
  }

  return true;
}

export function serializeProductList(products) {
  return serializeDocuments(products);
}
