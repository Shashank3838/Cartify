const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔍 DEBUG MIDDLEWARE
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// ================= USE ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes); // ✅ IMPORTANT (already correct)
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= DB CONNECT =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});