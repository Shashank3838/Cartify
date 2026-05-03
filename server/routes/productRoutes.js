const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");


// ================= CREATE PRODUCT (SELLER ONLY) =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    const product = new Product({
      name,
      price,
      description,
      image,
      seller: req.user.id,
      status: "pending"
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= GET APPROVED PRODUCTS (HOME) =================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= GET MY PRODUCTS (SELLER) =================
router.get("/my-products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= DELETE PRODUCT =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= UPDATE PRODUCT =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;

    product.status = "pending";

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= ADMIN: GET ALL PRODUCTS =================
router.get("/admin", authMiddleware, isAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= ADMIN: APPROVE =================
router.put("/:id/approve", authMiddleware, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "approved") {
      return res.json({ message: "Already approved" });
    }

    product.status = "approved";
    await product.save();

    res.json({ message: "Product approved ✅", product });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= ADMIN: REJECT =================
router.put("/:id/reject", authMiddleware, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "rejected") {
      return res.json({ message: "Already rejected" });
    }

    product.status = "rejected";
    await product.save();

    res.json({ message: "Product rejected ❌", product });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= 🔥 GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    console.error("❌ GET SINGLE PRODUCT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;