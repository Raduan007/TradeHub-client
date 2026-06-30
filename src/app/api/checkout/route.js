import { fetchProductById, updateProduct } from "@/lib/products";
import { getDb } from "@/lib/mongodb";
import { requireBuyerSession } from "@/lib/api-auth";

/**
 * POST /api/checkout
 * Expects JSON body: { productId: string, deliveryInfo: object, paymentDetails: object }
 * Returns: order details for success screen
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const productId = body.productId || "product010";
    const deliveryInfo = body.deliveryInfo || {};

    const authResult = await requireBuyerSession(request);
    if (authResult.error) {
      return authResult.error;
    }

    const buyerId = authResult.buyerId;
    const buyerName = authResult.user.name || "";
    const buyerEmail = authResult.user.email || "";

    let product = null;
    if (productId && productId !== "product010") {
      try {
        product = await fetchProductById(productId);
      } catch (err) {
        console.error("Fetch product by ID failed during checkout:", err);
      }
    }

    // Fallback product details if product not found or is demo
    if (!product) {
      product = {
        id: productId || "product010",
        title: "Nike Air Jordan 4 Retro",
        price: 285.00,
        image: "/images/products/product1.jpg",
        sellerId: "demo-seller-1",
        stock: 1
      };
    }

    const price = Number(product.price) || 285.00;
    const subtotal = price;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + tax).toFixed(2));

    // Generate random transaction ID and Order ID
    const transactionId = "TXN-" + Math.floor(100000000 + Math.random() * 900000000);
    const orderNumber = "MR" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const finalBuyerName = deliveryInfo.name || buyerName;
    const finalBuyerEmail = deliveryInfo.email || buyerEmail;
    const finalAddress = deliveryInfo.address || "New York, NY";
    const finalPhone = deliveryInfo.phone || "+1-555-0201";

    const db = await getDb();

    // 1. Create Buyer Order
    const buyerOrder = {
      buyerId,
      orderNumber,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image || "/images/products/product1.jpg",
      quantity: 1,
      amount: totalAmount,
      status: "processing",
      shippingAddress: `${finalBuyerName}\n${finalPhone}\n${finalBuyerEmail}\n${finalAddress}`,
      notes: "Simulated payment purchase",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("buyer_orders").insertOne(buyerOrder);

    // 2. Create Seller Order
    const sellerOrder = {
      sellerId: product.sellerId || "demo-seller-1",
      buyerId,
      buyerName: finalBuyerName,
      orderNumber,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image || "/images/products/product1.jpg",
      quantity: 1,
      amount: totalAmount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("seller_orders").insertOne(sellerOrder);

    // 3. Create Buyer Payment
    const payment = {
      buyerId,
      transactionId,
      orderNumber,
      amount: totalAmount,
      status: "completed",
      paymentMethod: "card",
      createdAt: new Date(),
    };
    await db.collection("buyer_payments").insertOne(payment);

    // 4. Update product stock/status if actual product
    if (product.id && product.id !== "product010") {
      try {
        const newStock = Math.max(0, (product.stock || 1) - 1);
        const updates = { stock: newStock };
        if (newStock === 0) {
          updates.status = "sold";
        }
        await updateProduct(product.id, updates);
      } catch (err) {
        console.error("Failed to update stock:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transactionId,
        orderId: "#" + orderNumber,
        productTitle: product.title,
        amount: totalAmount,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        status: "Paid"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Simulated Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

