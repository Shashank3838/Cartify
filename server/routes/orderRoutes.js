const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cartModel");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ CREATE ORDER
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { products } = req.body;

    let totalPrice = 0;

    for (let item of products) {
      const product = await Product.findById(item.product);
      totalPrice += product.price * item.quantity;
    }

    const order = new Order({
      user: req.user.id,
      products,
      totalPrice
    });

    await order.save();
    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET MY ORDERS
router.get("/", authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("products.product");
  res.json(orders);
});

// ✅ CHECKOUT (Cart → Order)
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;

    for (let item of cart.items) {
      const product = await Product.findById(item.product);
      totalPrice += product.price * item.quantity;
    }

    const order = new Order({
      user: req.user.id,
      products: cart.items,
      totalPrice
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE ORDER STATUS
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ VERIFY PAYMENT & CREATE ORDER
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;

    for (let item of cart.items) {
      const product = await Product.findById(item.product);
      totalPrice += product.price * item.quantity;
    }

    const order = new Order({
      user: req.user.id,
      products: cart.items,
      totalPrice,
      status: "paid"
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.json({
      message: "Payment verified & order created",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;