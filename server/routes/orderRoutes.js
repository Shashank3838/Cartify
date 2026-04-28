const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cartModel");
const { authMiddleware } = require("../middleware/authMiddleware");

// 🔥 MY ORDERS (USER SPECIFIC)
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ MY ORDERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// ✅ CREATE ORDER (AFTER PAYMENT SUCCESS)
// =====================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { products, paymentId } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    let totalPrice = 0;
    const orderProducts = [];

    for (let item of products) {
      const productData = await Product.findById(item.product);
      if (!productData) continue;

      totalPrice += productData.price * item.quantity;

      orderProducts.push({
        product: productData._id,
        name: productData.name,
        price: productData.price,
        quantity: item.quantity,
      });
    }

    if (orderProducts.length === 0) {
      return res.status(400).json({ message: "No valid products found" });
    }

    const order = new Order({
      user: req.user.id,
      products: orderProducts,
      totalPrice,

      // 🔥 PAYMENT INTEGRATION
      status: "paid",
      paymentStatus: "success",
      paymentId: paymentId || null,
    });

    await order.save();

    // 🔥 CLEAR CART AFTER SUCCESS PAYMENT
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json({
      message: "Order placed & payment successful 🎉",
      order,
    });

  } catch (error) {
    console.error("❌ ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// 🔥 USER: CANCEL ORDER
// =====================================
router.put("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ ONLY OWNER
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔥 FIX: ALLOW PENDING + PAID
    if (order.status !== "pending" && order.status !== "paid") {
      return res.status(400).json({
        message: "Only pending or paid orders can be cancelled",
      });
    }

    // 🔥 UPDATE STATUS
    order.status = "cancelled";

    // 🔥 HANDLE PAYMENT STATUS CLEANLY
    if (order.paymentStatus === "success") {
      order.paymentStatus = "refunded"; // later → "refunded"
    }

    await order.save();

    res.json({
      message: "Order cancelled successfully ❌",
      order,
    });

  } catch (error) {
    console.error("❌ CANCEL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// 🔥 ADMIN: GET ALL ORDERS
// =====================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);

  } catch (error) {
    console.error("❌ GET ORDERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// 🔥 ADMIN: UPDATE ORDER STATUS
// =====================================
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ❌ BLOCK CANCELLED ORDERS
    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot update cancelled order",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;