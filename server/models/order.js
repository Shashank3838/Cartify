const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      name: String,        // 🔥 snapshot
      price: Number,       // 🔥 snapshot

      quantity: {
        type: Number,
        default: 1
      }
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },

  // 🔥 ORDER STATUS (UPDATED)
  status: {
    type: String,
    enum: [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
      "return_requested", // 🔥 NEW
      "refunded"          // 🔥 NEW
    ],
    default: "pending"
  },

  // 🔥 PAYMENT STATUS (UPDATED)
  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "success",
      "failed",
      "refunded" // 🔥 NEW (IMPORTANT)
    ],
    default: "pending"
  },

  // 🔥 PAYMENT ID
  paymentId: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);