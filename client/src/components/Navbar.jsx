import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { cartCount } = useContext(CartContext);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/protected`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  const becomeSeller = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/become-seller`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

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
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const linkStyle = (path) =>
    `relative group px-3 py-1 transition-all duration-300 ${
      location.pathname === path
        ? "text-black"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <nav className="sticky top-4 z-50 mx-6 rounded-2xl px-8 py-3 flex items-center justify-between
      bg-white/70 backdrop-blur-lg border border-gray-200
      shadow-lg">

      <h1
        onClick={() => navigate("/")}
        className="text-xl font-semibold tracking-wide cursor-pointer
        text-black hover:opacity-70 transition"
      >
        Cartify 🛍️
      </h1>

      <div className="flex items-center w-[360px] bg-white 
        border border-gray-300 rounded-full px-4 py-1.5 
        focus-within:ring-2 focus-within:ring-gray-400 transition">

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

      <div className="flex items-center gap-6 text-sm font-medium">

        <Link to="/" className={linkStyle("/")}>Home</Link>

        <Link to="/cart" className="relative">
          <span className={linkStyle("/cart")}>Cart 🛒</span>

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-black text-white text-[10px] px-2 py-[2px] rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login" className={linkStyle("/login")}>Login</Link>
            <Link to="/register" className="px-4 py-1.5 rounded-full bg-black text-white">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/my-orders" className={linkStyle("/my-orders")}>Orders 📦</Link>

            <Link to="/wishlist">Wishlist ❤️</Link>

            {!loading && role && (
              <>
                {role === "user" && (
                  <button onClick={becomeSeller}>Become Seller 🚀</button>
                )}

                {role === "seller" && (
                  <Link to="/seller">Seller Dashboard 📦</Link>
                )}

                {role === "admin" && (
                  <>
                    <Link to="/seller">Seller Dashboard 📦</Link>
                    <Link to="/admin">Admin Dashboard 👑</Link>
                  </>
                )}
              </>
            )}

            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1.5 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;