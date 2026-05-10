const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  // 🔥 PRODUCT NAME
  name: {
    type: String,
    required: true,
    trim: true
  },

  // 🔥 PRICE
  price: {
    type: Number,
    required: true
  },

  // 🔥 DESCRIPTION
  description: {
    type: String,
    default: ""
  },

  // 🔥 CATEGORY
  category: {
    type: String,

    enum: [
      "Electronics",
      "Fashion",
      "Shoes",
      "Accessories",
      "Gaming",
      "Lifestyle",
      "Food",
      "Beauty",
      "Sports",
      "Books",
      "Toys",
      "Other"
    ],

    default: "Other",

    required: true
  },

  // 🔥 BRAND
  brand: {
    type: String,
    default: ""
  },

  // 🔥 STOCK
  stock: {
    type: Number,
    default: 1
  },

  // 🔥 SELLER REFERENCE
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🔥 PRODUCT IMAGE
  image: {
    type: String,
    default: ""
  },

  // 🔥 PRODUCT STATUS
  status: {
    type: String,

    enum: [
      "pending",
      "approved",
      "rejected"
    ],

    default: "pending"
  },

  // 🔥 FEATURED PRODUCT
  featured: {
    type: Boolean,
    default: false
  },

  // 🔥 RATINGS
  rating: {
    type: Number,
    default: 0
  },

  // 🔥 TOTAL REVIEWS
  totalReviews: {
    type: Number,
    default: 0
  },

  // 🔥 TOTAL SALES
  totalSales: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);