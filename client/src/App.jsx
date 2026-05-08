import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState } from "react";

import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";

function App() {

  // 🔥 AI ASSISTANT
  const [showAI, setShowAI] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey 👋 I’m Cartify AI. Ask me for product recommendations ✨",
    },
  ]);

  const [input, setInput] = useState("");

  const handleAI = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    let aiReply =
      "🔥 Cartify AI recommends checking our premium trending collection.";

    const lower = input.toLowerCase();

    if (lower.includes("shoe")) {
      aiReply =
        "👟 Premium sneakers are trending right now. Check the Trending section 😮‍💨";
    }

    if (
      lower.includes("cheap") ||
      lower.includes("budget")
    ) {
      aiReply =
        "💸 Try products under ₹2000 from our Fresh Arrivals section.";
    }

    if (
      lower.includes("premium") ||
      lower.includes("best")
    ) {
      aiReply =
        "✨ Our Editor’s Picks section has the most premium products.";
    }

    if (
      lower.includes("phone") ||
      lower.includes("gadget")
    ) {
      aiReply =
        "📱 Trending gadgets are HOT right now in Cartify.";
    }

    const aiMessage = {
      role: "ai",
      text: aiReply,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      aiMessage,
    ]);

    setInput("");
  };

  return (
    <Router>

      {/* 🔥 PREMIUM TOASTER */}
      <Toaster
        position="top-right"
        reverseOrder={false}

        toastOptions={{
          duration: 2500,

          style: {
            background: "#0f172a",
            color: "#fff",
            borderRadius: "18px",
            padding: "16px 20px",
            border:
              "1px solid rgba(255,255,255,0.08)",

            boxShadow:
              "0 10px 40px rgba(0,0,0,0.25)",

            fontWeight: "600",
          },

          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="min-h-screen bg-[#f5f7fb] flex flex-col">

        <Navbar />

        {/* MAIN CONTENT */}
        <div className="flex-1">

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            {/* PRODUCT DETAIL */}
            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />

            {/* WISHLIST */}
            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            {/* AUTH */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* SELLER */}
            <Route
              path="/seller"
              element={<SellerDashboard />}
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* ORDERS */}
            <Route
              path="/my-orders"
              element={<MyOrders />}
            />

          </Routes>
        </div>

        {/* 🔥 PREMIUM FOOTER */}
        <footer
          className="
          mt-20
          bg-black/95
          backdrop-blur-2xl
          text-white
          border-t border-white/10
        "
        >

          {/* TOP */}
          <div
            className="
            max-w-7xl mx-auto
            px-6 py-16
            grid md:grid-cols-4 gap-10
          "
          >

            {/* BRAND */}
            <div>

              <h1
                className="
                text-3xl font-extrabold mb-4
                bg-gradient-to-r
                from-white to-gray-400
                bg-clip-text text-transparent
              "
              >
                Cartify 🛍️
              </h1>

              <p
                className="
                text-gray-400 leading-7
              "
              >
                Premium multi-vendor ecommerce
                platform built for modern shopping
                experiences.
              </p>

              <div
                className="
                flex gap-4 mt-6 text-2xl
              "
              >

                {["📸", "🐦", "💼", "▶️"].map(
                  (icon, i) => (

                    <span
                      key={i}

                      className="
                      cursor-pointer
                      hover:scale-110
                      hover:-translate-y-1
                      transition-all duration-300
                    "
                    >
                      {icon}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* SHOP */}
            <div>

              <h2
                className="
                text-xl font-bold mb-5
              "
              >
                Shop
              </h2>

              <ul
                className="
                space-y-3 text-gray-400
              "
              >

                {[
                  "Trending Products",
                  "New Arrivals",
                  "Featured Picks",
                  "Best Sellers",
                ].map((item, i) => (

                  <li
                    key={i}

                    className="
                    hover:text-white
                    hover:translate-x-1
                    cursor-pointer
                    transition-all duration-300
                  "
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPANY */}
            <div>

              <h2
                className="
                text-xl font-bold mb-5
              "
              >
                Company
              </h2>

              <ul
                className="
                space-y-3 text-gray-400
              "
              >

                {[
                  "About Us",
                  "Careers",
                  "Privacy Policy",
                  "Terms & Conditions",
                ].map((item, i) => (

                  <li
                    key={i}

                    className="
                    hover:text-white
                    hover:translate-x-1
                    cursor-pointer
                    transition-all duration-300
                  "
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div>

              <h2
                className="
                text-xl font-bold mb-5
              "
              >
                Stay Updated ✨
              </h2>

              <p
                className="
                text-gray-400 mb-5
              "
              >
                Get latest product drops and premium
                deals directly in your inbox.
              </p>

              <div className="flex flex-col gap-3">

                <input
                  type="email"

                  placeholder="Enter your email"

                  className="
                  px-4 py-3 rounded-xl

                  bg-[#111827]

                  border border-gray-700

                  outline-none

                  focus:border-white

                  transition-all duration-300
                "
                />

                <button
                  className="
                  bg-white text-black

                  py-3 rounded-xl
                  font-semibold

                  hover:scale-[1.02]
                  hover:shadow-[0_15px_40px_rgba(255,255,255,0.15)]

                  transition-all duration-300
                "
                >
                  Subscribe 🚀
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div
            className="
            border-t border-gray-800
            py-6 px-6
          "
          >

            <div
              className="
              max-w-7xl mx-auto

              flex flex-col md:flex-row

              justify-between items-center

              gap-4

              text-gray-500 text-sm
            "
            >

              <p>
                © 2026 Cartify. All rights reserved.
              </p>

              <div className="flex gap-6">

                {[
                  "Privacy",
                  "Terms",
                  "Support",
                ].map((item, i) => (

                  <span
                    key={i}

                    className="
                    hover:text-white
                    cursor-pointer
                    transition-all duration-300
                  "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* 🔥 AI ORB BUTTON */}
        <button
          onClick={() =>
            setShowAI(!showAI)
          }

          className="
          fixed bottom-6 right-6

          w-20 h-20 rounded-full

          bg-gradient-to-br
          from-black to-gray-800

          text-white text-3xl

          shadow-[0_0_50px_rgba(0,0,0,0.5)]

          hover:scale-110
          hover:rotate-6

          transition-all duration-500

          z-50

          animate-pulse
        "
        >

          <div
            className="
            absolute inset-0 rounded-full

            border border-white/20

            animate-spin
          "
            style={{
              animationDuration: "6s",
            }}
          />

          <span className="relative z-10">
            ✨
          </span>
        </button>

        {/* 🔥 AI PANEL */}
        {showAI && (

          <div
            className="
            fixed bottom-32 right-6

            w-[360px] h-[520px]

            bg-white/90 backdrop-blur-2xl

            border border-white/60

            rounded-[35px]

            shadow-[0_20px_80px_rgba(0,0,0,0.2)]

            flex flex-col overflow-hidden

            z-50

            animate-[fadeIn_.3s_ease]
          "
          >

            {/* HEADER */}
            <div
              className="
              bg-black text-white

              p-5

              flex items-center justify-between
            "
            >

              <div>

                <h2
                  className="
                  font-black text-xl
                "
                >
                  Cartify AI ✨
                </h2>

                <p
                  className="
                  text-sm text-gray-300
                "
                >
                  Premium Shopping Assistant
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAI(false)
                }

                className="
                text-2xl
                hover:rotate-90
                transition duration-300
              "
              >
                ×
              </button>
            </div>

            {/* CHAT */}
            <div
              className="
              flex-1 overflow-y-auto

              p-5 space-y-4
            "
            >

              {messages.map((msg, i) => (

                <div
                  key={i}

                  className={`
                  max-w-[85%]

                  p-4 rounded-3xl

                  text-sm leading-7

                  shadow-lg

                  ${
                    msg.role === "user"

                      ? `
                        bg-black text-white
                        ml-auto
                      `

                      : `
                        bg-gray-100 text-gray-800
                      `
                  }
                `}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div
              className="
              p-4 border-t

              flex gap-3
            "
            >

              <input
                type="text"

                value={input}

                onChange={(e) =>
                  setInput(e.target.value)
                }

                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAI();
                  }
                }}

                placeholder="Ask Cartify AI..."

                className="
                flex-1 px-4 py-3

                rounded-2xl border

                outline-none

                focus:ring-2
                focus:ring-black

                transition-all duration-300
              "
              />

              <button
                onClick={handleAI}

                className="
                px-5 rounded-2xl

                bg-black text-white

                hover:scale-105

                transition-all duration-300
              "
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;