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

      // 🔥 PRODUCT SNAPSHOT
      name: String,

      price: Number,

      image: String,

      category: String,

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

  // 🔥 SHIPPING
  shippingAddress: {

    fullName: String,

    phone: String,

    address: String,

    city: String,

    state: String,

    pincode: String
  },

  // 🔥 ORDER STATUS
  status: {
    type: String,
    enum: [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
      "return_requested",
      "refunded"
    ],
    default: "pending"
  },

  // 🔥 PAYMENT STATUS
  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "success",
      "failed",
      "refunded"
    ],
    default: "pending"
  },

  // 🔥 PAYMENT ID
  paymentId: {
    type: String
  },

  deliveredAt: Date

}, { timestamps: true });

module.exports =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);