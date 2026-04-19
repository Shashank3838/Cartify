const express = require("express");
const router = express.Router();
const Cart = require("../models/cartModel.js");
console.log("Cart model check:", Cart);
const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ ADD TO CART
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
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET CART
router.get("/", authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  res.json(cart);
});

// ✅ REMOVE ITEM
router.delete("/:productId", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });

if (!cart) {
  return res.status(404).json({ message: "Cart not found" });
}

cart.items = cart.items.filter(
  item => item.product.toString() !== req.params.productId
);

  await cart.save();

  res.json(cart);
});

module.exports = router;