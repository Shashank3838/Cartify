const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 👇 VERY IMPORTANT LINE
const authRoutes = require("./routes/authRoutes");

// 👇 ADD THIS
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// 👇 THIS CONNECTS ROUTES
app.use("/api/auth", authRoutes);
const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

// 👇 ADD THIS PROTECTED ROUTE
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route!",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});