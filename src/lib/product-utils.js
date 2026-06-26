export function getProductValue(product, keys, fallback = "") {
  for (const key of keys) {
    if (product?.[key] !== undefined && product?.[key] !== null && product?.[key] !== "") {
      return product[key];
    }
  }

  return fallback;
}

export function getProductImage(product) {
  const image = getProductValue(product, [
    "image",
    "imageUrl",
    "image_url",
    "photo",
    "photoURL",
    "thumbnail",
    "picture",
  ]);

  if (image) {
    return image;
  }

  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images[0];
  }

  return "/images/products/product1.jpg";
}

export function getProductId(product) {
  return getProductValue(product, ["id", "_id", "productId"]);
}

export function normalizeProduct(product) {
  const rawPrice = getProductValue(product, ["price", "resalePrice", "amount"]);
  const numericPrice = Number(rawPrice);

  return {
    id: getProductId(product),
    title: getProductValue(product, ["title", "name", "productName"], "Untitled product"),
    name: getProductValue(product, ["name", "title", "productName"], "Untitled product"),
    price: Number.isNaN(numericPrice) ? 0 : numericPrice,
    priceLabel: Number.isNaN(numericPrice)
      ? "Price negotiable"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(numericPrice),
    image: getProductImage(product),
    images: Array.isArray(product?.images)
      ? product.images
      : [getProductImage(product)],
    category: getProductValue(product, ["category", "type"], "General"),
    location: getProductValue(product, ["location", "city", "address"], "Bangladesh"),
    condition: getProductValue(product, ["condition", "status"], "Good"),
    description: getProductValue(product, ["description"], "No description provided."),
    stock: Number(getProductValue(product, ["stock"], 1)) || 1,
    brand: getProductValue(product, ["brand"], ""),
    sellerId: getProductValue(product, ["sellerId"], ""),
    sellerInfo: product?.sellerInfo || null,
    status: getProductValue(product, ["status"], "available"),
    createdAt: product?.createdAt,
  };
}

export function normalizeProducts(products) {
  return (products || []).map(normalizeProduct);
}
