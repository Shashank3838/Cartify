import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist"; // 🔥 NEW

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />

        {/* 🔥 PRODUCT DETAIL */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* ❤️ WISHLIST */}
        <Route path="/wishlist" element={<Wishlist />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* SELLER */}
        <Route path="/seller" element={<SellerDashboard />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ORDERS */}
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </Router>
  );
}

export default App;