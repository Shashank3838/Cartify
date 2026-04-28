const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  description: String,

  // seller reference
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  image: String,

  // 🔥 NEW (REPLACES isApproved)
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);