import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // 🔥 CART DRAWER
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const {
    cart,
    cartCount,
    total,
    removeFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // 🔥 FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/protected`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await res.json();

        if (res.ok && data.user?.role) {
          setRole(data.user.role);
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error(err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchUser();
    else {
      setLoading(false);
      setRole(null);
    }
  }, [isLoggedIn]);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔥 LIVE SEARCH
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts
      .filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(filtered);
  }, [search, allProducts]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("storage"));

    setIsLoggedIn(false);
    setRole(null);

    navigate("/login");
  };

  const becomeSeller = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/become-seller`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      alert(data.message);

      setRole("seller");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(`/?q=${search}`);

    setSuggestions([]);
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (name) => {
    navigate(`/?q=${name}`);

    setSuggestions([]);
    setSearch("");
  };

  const linkStyle = (path) =>
    `relative group px-3 py-1 transition-all duration-300 ${
      location.pathname === path
        ? "text-black"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="sticky top-4 z-50 mx-4 sm:mx-6 rounded-2xl px-4 sm:px-8 py-3
        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
        bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg"
      >
        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-semibold tracking-wide cursor-pointer
          text-black hover:opacity-70 transition"
        >
          Cartify 🛍️
        </h1>

        {/* SEARCH */}
        <div className="relative w-full sm:w-[360px]">

          <div
            className="flex items-center bg-white
            border border-gray-300 rounded-full px-4 py-1.5
            focus-within:ring-2 focus-within:ring-gray-400 transition"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-black px-2 w-full placeholder-gray-500 text-sm"
            />

            <button
              onClick={handleSearch}
              className="text-gray-600 hover:text-black transition"
            >
              🔍
            </button>
          </div>

          {/* SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div
              className="absolute top-14 left-0 w-full bg-white rounded-2xl
              shadow-2xl border border-gray-200 overflow-hidden z-50"
            >
              {suggestions.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleSuggestionClick(item.name)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100
                  transition flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      ₹{item.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LINKS */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm font-medium w-full sm:w-auto">

          <Link to="/" className={linkStyle("/")}>
            Home
          </Link>

          {/* 🔥 CART BUTTON */}
          <button
            onClick={() => setShowCartDrawer(true)}
            className="relative"
          >
            <span className={linkStyle("/cart")}>
              Cart 🛒
            </span>

            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-3 bg-black text-white
                text-[10px] px-2 py-[2px] rounded-full"
              >
                {cartCount}
              </span>
            )}
          </button>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className={linkStyle("/login")}>
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-black text-white"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/my-orders"
                className={linkStyle("/my-orders")}
              >
                Orders 📦
              </Link>

              <Link to="/wishlist">
                Wishlist ❤️
              </Link>

              {!loading && role && (
                <>
                  {role === "user" && (
                    <button onClick={becomeSeller}>
                      Become Seller 🚀
                    </button>
                  )}

                  {role === "seller" && (
                    <Link to="/seller">
                      Seller Dashboard 📦
                    </Link>
                  )}

                  {role === "admin" && (
                    <>
                      <Link to="/seller">
                        Seller Dashboard 📦
                      </Link>

                      <Link to="/admin">
                        Admin Dashboard 👑
                      </Link>
                    </>
                  )}
                </>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 🔥 BACKDROP */}
      {showCartDrawer && (
        <div
          onClick={() => setShowCartDrawer(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* 🔥 CART DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px]
        bg-white z-50 shadow-2xl transition-transform duration-500
        flex flex-col
        ${showCartDrawer ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            Your Cart 🛒
          </h2>

          <button
            onClick={() => setShowCartDrawer(false)}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {cart.length === 0 ? (
            <div className="text-center mt-20 text-gray-500">
              Your cart is empty 🛍️
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 bg-gray-50 rounded-2xl p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-sm">
                    {item.name}
                  </h3>

                  <p className="font-bold mt-1">
                    ₹{item.price}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Qty: {item.qty}
                  </p>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 text-xs mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t p-5">
          <div className="flex justify-between mb-4">
            <span className="font-medium">
              Total
            </span>

            <span className="font-bold">
              ₹{total}
            </span>
          </div>

          <button
            onClick={() => {
              setShowCartDrawer(false);
              navigate("/cart");
            }}
            className="w-full bg-black text-white py-3 rounded-xl
            hover:opacity-90 transition"
          >
            Open Full Cart
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;