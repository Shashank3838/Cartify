const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cartModel");

const {
  authMiddleware,
} = require("../middleware/authMiddleware");

// =====================================
// 🔥 MY ORDERS (USER SPECIFIC)
// =====================================
router.get(
  "/my-orders",
  authMiddleware,
  async (req, res) => {
    try {

      const orders = await Order.find({
        user: req.user.id,
      }).sort({ createdAt: -1 });

      res.json(orders);

    } catch (error) {

      console.error(
        "❌ MY ORDERS ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================
// ✅ CREATE ORDER
// =====================================
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {

      const {
        products,
        paymentId,
        shippingAddress,
      } = req.body;

      if (
        !products ||
        products.length === 0
      ) {
        return res.status(400).json({
          message:
            "No products provided",
        });
      }

      let totalPrice = 0;

      const orderProducts = [];

      // 🔥 BUILD ORDER PRODUCTS
      for (let item of products) {

        const productData =
          await Product.findById(
            item.product
          );

        if (!productData) continue;

        totalPrice +=
          productData.price *
          item.quantity;

        orderProducts.push({

          product:
            productData._id,

          name:
            productData.name,

          price:
            productData.price,

          image:
            productData.image,

          category:
            productData.category,

          quantity:
            item.quantity,
        });
      }

      if (
        orderProducts.length === 0
      ) {
        return res.status(400).json({
          message:
            "No valid products found",
        });
      }

      // 🔥 CREATE ORDER
      const order =
        await Order.create({

          user: req.user.id,

          products:
            orderProducts,

          totalPrice,

          status: "paid",

          paymentStatus:
            "success",

          paymentId:
            paymentId || null,

          shippingAddress:
            shippingAddress || {},
        });

      // 🔥 CLEAR CART
      const cart =
        await Cart.findOne({
          user: req.user.id,
        });

      if (cart) {

        cart.items = [];

        await cart.save();
      }

      res.status(201).json({
        message:
          "Order placed successfully 🎉",

        order,
      });

    } catch (error) {

      console.error(
        "❌ ORDER ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================
// 🔥 USER CANCEL ORDER
// =====================================
router.put(
  "/cancel/:id",
  authMiddleware,
  async (req, res) => {
    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      if (
        order.user.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      if (
        order.status !==
          "pending" &&
        order.status !== "paid"
      ) {
        return res.status(400).json({
          message:
            "Only pending or paid orders can be cancelled",
        });
      }

      order.status =
        "cancelled";

      if (
        order.paymentStatus ===
        "success"
      ) {
        order.paymentStatus =
          "refunded";
      }

      await order.save();

      res.json({
        message:
          "Order cancelled successfully",

        order,
      });

    } catch (error) {

      console.error(
        "❌ CANCEL ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================
// 🔥 USER RETURN REQUEST
// =====================================
router.put(
  "/return/:id",
  authMiddleware,
  async (req, res) => {
    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      if (
        order.user.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      if (
        order.status !==
        "delivered"
      ) {
        return res.status(400).json({
          message:
            "Only delivered orders can be returned",
        });
      }

      order.status =
        "return_requested";

      await order.save();

      res.json({
        message:
          "Return request submitted",

        order,
      });

    } catch (error) {

      console.error(
        "❌ RETURN ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================
// 🔥 ADMIN GET ALL ORDERS
// =====================================
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {

      if (
        req.user.role
          ?.toLowerCase() !==
        "admin"
      ) {
        return res.status(403).json({
          message:
            "Admin access only",
        });
      }

      const orders =
        await Order.find()
          .sort({ createdAt: -1 });

      res.json(orders);

    } catch (error) {

      console.error(
        "❌ GET ORDERS ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================
// 🔥 ADMIN UPDATE STATUS
// =====================================
router.put(
  "/:id/status",
  authMiddleware,
  async (req, res) => {
    try {

      if (
        req.user.role
          ?.toLowerCase() !==
        "admin"
      ) {
        return res.status(403).json({
          message:
            "Admin access only",
        });
      }

      const { status } =
        req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.status = status;

      if (
        status === "refunded"
      ) {
        order.paymentStatus =
          "refunded";
      }

      if (
        status === "delivered"
      ) {
        order.deliveredAt =
          new Date();
      }

      await order.save();

      res.json({
        message:
          "Order status updated",

        order,
      });

    } catch (error) {

      console.error(
        "❌ UPDATE ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;