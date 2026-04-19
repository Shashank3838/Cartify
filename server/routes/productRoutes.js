const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ CREATE PRODUCT (PROTECTED)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const product = new Product({
      name,
      price,
      description,
      user: req.user.id
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
// ✅ DELETE PRODUCT (ONLY OWNER)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 check ownership
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ✅ UPDATE PRODUCT (ONLY OWNER)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 check ownership
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ✅ GET MY PRODUCTS (ONLY LOGGED-IN USER)
router.get("/my-products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;