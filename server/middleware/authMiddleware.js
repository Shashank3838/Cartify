const jwt = require("jsonwebtoken");

// 🔐 AUTH MIDDLEWARE
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 attach user
    req.user = verified;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};


// 👑 ADMIN CHECK
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  next();
};


// 🔥 EXPORT PROPERLY (IMPORTANT)
module.exports = {
  authMiddleware,
  isAdmin
};