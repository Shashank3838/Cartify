const express = require("express");
const router = express.Router();
const Cart = require("../models/cartModel.js");
const Product = require("../models/product");
const Order = require("../models/order");

// 🔥 FIXED IMPORT
const { authMiddleware } = require("../middleware/authMiddleware");


// ================= ADD TO CART =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= GET CART =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= REMOVE ITEM =================
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= CHECKOUT =================
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;

    const orderProducts = cart.items.map(item => {
      const product = item.product;

      totalPrice += product.price * item.quantity;

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      };
    });

    const order = new Order({
      user: req.user.id,
      products: orderProducts,
      totalPrice
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.json({
      message: "Order placed successfully 🎉",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= 🔥 CLEAR CART (NEW) =================
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ message: "Cart cleared successfully 🧹" });

  } catch (error) {
    console.error("❌ CLEAR CART ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;