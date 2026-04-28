import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

        const res = await fetch("http://localhost:5000/api/auth/protected", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();

        if (res.ok && data.user && data.user.role) {
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

    if (isLoggedIn) {
      fetchUser();
    } else {
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
      const res = await fetch("http://localhost:5000/api/auth/become-seller", {
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

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold">MyStore 🛍️</h1>

      <div className="flex gap-6 items-center">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart 🛒</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {/* 🔥 NEW: USER ORDERS (FOR ALL LOGGED IN USERS) */}
            <Link to="/my-orders" className="text-blue-400">
              My Orders 🧾
            </Link>

            {!loading && role && (
              <>
                {role === "user" && (
                  <button onClick={becomeSeller} className="text-yellow-400">
                    Become Seller 🚀
                  </button>
                )}

                {role === "seller" && (
                  <Link to="/seller" className="text-green-400">
                    Seller Dashboard 📦
                  </Link>
                )}

                {role === "admin" && (
                  <>
                    <Link to="/seller" className="text-green-400">
                      Seller Dashboard 📦
                    </Link>
                    <Link to="/admin" className="text-purple-400">
                      Admin Dashboard 👑
                    </Link>
                  </>
                )}
              </>
            )}

            <button onClick={handleLogout} className="text-red-400">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;