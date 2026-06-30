// src/app/api/orders/route.js
import { getDb } from "@/lib/mongodb";
import { fetchProductById, updateProduct } from "@/lib/products";
import { requireBuyerSession } from "@/lib/api-auth";

/**
 * POST /api/orders
 * Body: { productId: string, deliveryInfo: object, paymentDetails: object }
 * Creates an order record (no real payment) and returns order details.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const productId = body.productId || "product010";
    const deliveryInfo = body.deliveryInfo || {};
    const paymentDetails = body.paymentDetails || {};

    // fetch product (fallback to demo)
    let product = null;
    if (productId && productId !== "product010") {
      try {
        product = await fetchProductById(productId);
      } catch (_) {}
    }
    if (!product) {
      product = {
        id: productId || "product010",
        title: "Nike Air Jordan 4 Retro",
        price: 285.0,
        image: "/images/products/product1.jpg",
        sellerId: "demo-seller-1",
        stock: 1,
      };
    }

    const price = Number(product.price) || 285.0;
    const subtotal = price;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    // generate IDs
    const transactionId = "TXN-" + Math.floor(100000000 + Math.random() * 900000000);
    const orderNumber = "MR" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // buyer info (fallback demo)
    let buyerId = "demo-buyer-1";
    let buyerName = "Chris Wang";
    let buyerEmail = "buyer1@resellhub.com";
    try {
      const authResult = await requireBuyerSession(request);
      if (!authResult.error) {
        buyerId = authResult.buyerId;
        buyerName = authResult.user.name || buyerName;
        buyerEmail = authResult.user.email || buyerEmail;
      }
    } catch (e) {
      console.warn("Buyer session unavailable, using demo fallback:", e.message);
    }

    // final fields (allow overrides from deliveryInfo)
    const finalBuyerName = deliveryInfo.name || buyerName;
    const finalBuyerEmail = deliveryInfo.email || buyerEmail;
    const finalAddress = deliveryInfo.address || "New York, NY";
    const finalPhone = deliveryInfo.phone || "+1-555-0201";

    const db = await getDb();

    // 1. Buyer order
    const buyerOrder = {
      buyerId,
      orderNumber,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image || "/images/products/product1.jpg",
      quantity: 1,
      amount: total,
      status: "processing",
      shippingAddress: `${finalBuyerName}\n${finalPhone}\n${finalBuyerEmail}\n${finalAddress}`,
      notes: "Simulated order (no real payment)",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("buyer_orders").insertOne(buyerOrder);

    // 2. Seller order
    const sellerOrder = {
      sellerId: product.sellerId || "demo-seller-1",
      buyerId,
      buyerName: finalBuyerName,
      orderNumber,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image || "/images/products/product1.jpg",
      quantity: 1,
      amount: total,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("seller_orders").insertOne(sellerOrder);

    // 3. Payment record (simulated)
    const payment = {
      buyerId,
      transactionId,
      orderNumber,
      amount: total,
      status: "completed",
      paymentMethod: "demo",
      createdAt: new Date(),
    };
    await db.collection("buyer_payments").insertOne(payment);

    // 4. Update stock if real product
    if (product.id && product.id !== "product010") {
      try {
        const newStock = Math.max(0, (product.stock || 1) - 1);
        const updates = { stock: newStock };
        if (newStock === 0) updates.status = "sold";
        await updateProduct(product.id, updates);
      } catch (err) {
        console.error("Failed to update stock:", err);
      }
    }

    // response
    return new Response(
      JSON.stringify({
        success: true,
        transactionId,
        orderId: "#" + orderNumber,
        productTitle: product.title,
        amount: total,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        status: "Paid",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
