const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cartModel");

const { authMiddleware } = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ================= CREATE PAYMENT ORDER =================
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    console.error("❌ CREATE ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ================= VERIFY PAYMENT + CREATE ORDER =================
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products
    } = req.body;

    // 🔥 STEP 1: VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed ❌"
      });
    }

    // 🔥 STEP 2: CREATE ORDER (ONLY AFTER VERIFIED)
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
      return res.status(400).json({
        success: false,
        message: "No valid products found"
      });
    }

    const order = new Order({
      user: req.user.id,
      products: orderProducts,
      totalPrice,

      // 🔥 PAYMENT INFO
      status: "paid",
      paymentStatus: "success",
      paymentId: razorpay_payment_id,
    });

    await order.save();

    // 🔥 STEP 3: CLEAR CART
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // 🔥 FINAL RESPONSE
    res.json({
      success: true,
      message: "Payment verified & order placed 🎉",
      order,
    });

  } catch (error) {
    console.error("❌ VERIFY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;