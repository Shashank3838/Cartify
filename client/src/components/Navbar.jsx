import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

import LoadingScreen from "./LoadingScreen";

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const [pageLoading, setPageLoading] = useState(false);

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

    return () =>
      window.removeEventListener(
        "storage",
        syncAuth
      );

  }, []);

  // FETCH USER
  useEffect(() => {

    const fetchUser = async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/protected`,
          {
            headers: {
              Authorization:
                "Bearer " + token,
            },
          }
        );

        const data = await res.json();

        if (
          res.ok &&
          data.user?.role
        ) {
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

  // FETCH PRODUCTS
  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/products`
    )
      .then((res) => res.json())
      .then((data) => {

        setAllProducts(data);

      })
      .catch((err) =>
        console.error(err)
      );

  }, []);

  // LIVE SEARCH
  useEffect(() => {

    if (!search.trim()) {

      setSuggestions([]);

      return;
    }

    const filtered = allProducts
      .filter((p) =>
        p.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .slice(0, 6);

    setSuggestions(filtered);

  }, [search, allProducts]);

  // LOADING NAVIGATION
  const navigateWithLoading = (path) => {

    setPageLoading(true);

    setTimeout(() => {

      navigate(path);

      setPageLoading(false);

    }, 1400);
  };

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.dispatchEvent(
      new Event("storage")
    );

    setIsLoggedIn(false);

    setRole(null);

    navigateWithLoading("/login");
  };

  const becomeSeller = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/become-seller`,
        {
          method: "PUT",
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      setRole("seller");

      alert(data.message);

    } catch (err) {

      console.error(err);
    }
  };

  const handleSearch = () => {

    if (!search.trim()) return;

    navigateWithLoading(`/?q=${search}`);

    setSuggestions([]);

    setSearch("");
  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      handleSearch();
    }
  };

  const handleSuggestionClick = (name) => {

    navigateWithLoading(`/?q=${name}`);

    setSuggestions([]);

    setSearch("");
  };

  const linkStyle = (path) =>
    `relative px-1 py-1 text-[15px] font-medium transition-all duration-300
    ${
      location.pathname === path
        ? "text-black"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <>
      {/* LOADING SCREEN */}
      {pageLoading && <LoadingScreen />}

      {/* NAVBAR */}
      <nav
        className="
        sticky top-4 z-50
        mx-4 lg:mx-8
        rounded-[28px]
        border border-white/40
        bg-white/75
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        px-5 lg:px-8
        py-4
        transition-all duration-500
      "
      >

        <div
          className="
          flex flex-col lg:flex-row
          items-center justify-between gap-5
        "
        >

          {/* LEFT */}
          <div
            className="
            flex items-center gap-10
            w-full lg:w-auto
          "
          >

            {/* LOGO */}
            <div
              onClick={() =>
                navigateWithLoading("/")
              }

              className="
              group flex items-center
              gap-3 cursor-pointer
            "
            >

              <div
                className="
                w-11 h-11 rounded-2xl
                bg-gradient-to-br
                from-black to-gray-800

                text-white

                flex items-center
                justify-center

                text-lg

                shadow-lg

                group-hover:scale-110

                transition-all duration-300
              "
              >
                🛍️
              </div>

              <div>

                <h1
                  className="
                  text-2xl font-black
                  tracking-tight

                  bg-gradient-to-r
                  from-black to-gray-600

                  bg-clip-text
                  text-transparent
                "
                >
                  Cartify
                </h1>

                <p
                  className="
                  text-[11px]
                  text-gray-500

                  -mt-1
                  tracking-widest
                "
                >
                  PREMIUM STORE
                </p>
              </div>
            </div>

            {/* SEARCH */}
            <div
              className="
              hidden md:block
              relative w-[380px]
            "
            >

              <div
                className="
                flex items-center gap-3

                bg-white/90

                border border-gray-200

                rounded-full

                px-5 py-3

                shadow-sm

                focus-within:shadow-xl

                focus-within:scale-[1.02]

                focus-within:border-gray-400

                transition-all duration-300
              "
              >

                <span className="text-lg">
                  🔍
                </span>

                <input
                  type="text"

                  placeholder="Search premium products..."

                  value={search}

                  onChange={(e) =>
                    setSearch(e.target.value)
                  }

                  onKeyDown={handleKeyDown}

                  className="
                  bg-transparent outline-none
                  w-full text-sm text-black

                  placeholder:text-gray-400
                "
                />

                {search && (

                  <button
                    onClick={() => {

                      setSearch("");

                      setSuggestions([]);
                    }}

                    className="
                    text-gray-400
                    hover:text-black

                    transition
                  "
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* SUGGESTIONS */}
              {suggestions.length > 0 && (

                <div
                  className="
                  absolute top-16 left-0 w-full

                  bg-white/95 backdrop-blur-xl

                  rounded-3xl

                  border border-gray-200

                  shadow-2xl

                  overflow-hidden

                  z-50
                "
                >

                  {suggestions.map((item) => (

                    <button
                      key={item._id}

                      onClick={() =>
                        handleSuggestionClick(
                          item.name
                        )
                      }

                      className="
                      w-full text-left

                      px-5 py-4

                      hover:bg-gray-100/80

                      transition-all duration-200

                      flex items-center gap-4
                    "
                    >

                      <img
                        src={item.image}
                        alt={item.name}

                        className="
                        w-14 h-14 rounded-2xl

                        object-cover

                        shadow-md
                      "
                      />

                      <div className="flex-1">

                        <p
                          className="
                          font-semibold text-gray-800
                        "
                        >
                          {item.name}
                        </p>

                        <p
                          className="
                          text-sm text-gray-500
                        "
                        >
                          ₹{item.price}
                        </p>
                      </div>

                      <span className="text-gray-400">
                        ↗
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
            flex flex-wrap items-center
            justify-center gap-6 text-sm
          "
          >

            <button
              onClick={() =>
                navigateWithLoading("/")
              }

              className={linkStyle("/")}
            >
              <span
                className="
                hover:-translate-y-[2px]
                transition inline-block
              "
              >
                Home
              </span>
            </button>

            {/* CART */}
            <button
              onClick={() =>
                setShowCartDrawer(true)
              }

              className={linkStyle("/cart")}
            >
              Cart

              {cartCount > 0 && (

                <span className="ml-1">
                  ({cartCount})
                </span>
              )}
            </button>

            {!isLoggedIn ? (
              <>

                <button
                  onClick={() =>
                    navigateWithLoading(
                      "/login"
                    )
                  }

                  className={linkStyle("/login")}
                >
                  Login
                </button>

                <button
                  onClick={() =>
                    navigateWithLoading(
                      "/register"
                    )
                  }

                  className="
                  px-5 py-2.5 rounded-full

                  bg-gradient-to-r
                  from-black to-gray-800

                  text-white font-semibold

                  shadow-lg shadow-black/20

                  hover:scale-105
                  hover:shadow-xl

                  transition-all duration-300
                "
                >
                  Register
                </button>
              </>
            ) : (
              <>

                <button
                  onClick={() =>
                    navigateWithLoading(
                      "/my-orders"
                    )
                  }

                  className={linkStyle("/my-orders")}
                >
                  Orders
                </button>

                <button
                  onClick={() =>
                    navigateWithLoading(
                      "/wishlist"
                    )
                  }

                  className={linkStyle("/wishlist")}
                >
                  Wishlist
                </button>

                {!loading && role && (
                  <>

                    {role === "user" && (

                      <button
                        onClick={becomeSeller}

                        className="
                        px-4 py-2 rounded-full

                        bg-gradient-to-r
                        from-gray-100 to-gray-200

                        hover:from-black
                        hover:to-gray-800

                        hover:text-white

                        transition-all duration-300
                      "
                      >
                        Become Seller
                      </button>
                    )}

                    {role === "seller" && (

                      <button
                        onClick={() =>
                          navigateWithLoading(
                            "/seller"
                          )
                        }

                        className={linkStyle("/seller")}
                      >
                        Seller
                      </button>
                    )}

                    {role === "admin" && (
                      <>
                        <button
                          onClick={() =>
                            navigateWithLoading(
                              "/seller"
                            )
                          }

                          className={linkStyle("/seller")}
                        >
                          Seller
                        </button>

                        <button
                          onClick={() =>
                            navigateWithLoading(
                              "/admin"
                            )
                          }

                          className={linkStyle("/admin")}
                        >
                          Admin
                        </button>
                      </>
                    )}
                  </>
                )}

                <button
                  onClick={handleLogout}

                  className="
                  px-5 py-2 rounded-full

                  bg-red-500 text-white

                  hover:bg-red-600
                  hover:scale-105

                  shadow-lg

                  transition-all duration-300
                "
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden mt-4 relative">

          <div
            className="
            flex items-center gap-3

            bg-white border border-gray-200

            rounded-full px-4 py-3
          "
          >

            <span>🔍</span>

            <input
              type="text"

              placeholder="Search products..."

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

              onKeyDown={handleKeyDown}

              className="
              bg-transparent outline-none
              w-full text-sm
            "
            />
          </div>
        </div>
      </nav>

      {/* BACKDROP */}
      {showCartDrawer && (

        <div
          onClick={() =>
            setShowCartDrawer(false)
          }

          className="
          fixed inset-0 z-40

          bg-black/40

          backdrop-blur-sm
        "
        />
      )}

      {/* CART DRAWER */}
      <div
        className={`
        fixed top-0 right-0 h-full

        w-[390px]

        bg-white/95 backdrop-blur-2xl

        z-50

        border-l border-gray-200

        shadow-[0_0_40px_rgba(0,0,0,0.15)]

        transition-transform duration-500

        flex flex-col

        ${
          showCartDrawer
            ? "translate-x-0"
            : "translate-x-full"
        }
      `}
      >

        {/* HEADER */}
        <div
          className="
          flex items-center justify-between

          p-6

          border-b border-gray-200
        "
        >

          <div>

            <h2
              className="
              text-2xl font-black text-black
            "
            >
              Your Cart
            </h2>

            <p
              className="
              text-sm text-gray-500 mt-1
            "
            >
              Premium shopping experience
            </p>
          </div>

          <button
            onClick={() =>
              setShowCartDrawer(false)
            }

            className="
            w-10 h-10 rounded-full

            bg-gray-100

            hover:bg-black
            hover:text-white

            transition-all duration-300
          "
          >
            ✕
          </button>
        </div>

        {/* ITEMS */}
        <div
          className="
          flex-1 overflow-y-auto

          p-5 space-y-4
        "
        >

          {cart.length === 0 ? (
            <div className="text-center mt-24">

              <div className="text-6xl mb-5">
                🛍️
              </div>

              <h3
                className="
                text-xl font-bold text-gray-800
              "
              >
                Cart is Empty
              </h3>

              <p
                className="
                text-gray-500 mt-2 text-sm
              "
              >
                Add premium products to continue
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}

                className="
                flex gap-4

                bg-gradient-to-br
                from-gray-50 to-white

                border border-gray-100

                rounded-3xl

                p-4

                hover:shadow-xl
                hover:-translate-y-1

                transition-all duration-300
              "
              >

                <img
                  src={item.image}
                  alt={item.name}

                  className="
                  w-24 h-24 rounded-2xl

                  object-cover

                  shadow-md
                "
                />

                <div className="flex-1">

                  <h3
                    className="
                    font-semibold text-gray-800
                  "
                  >
                    {item.name}
                  </h3>

                  <p
                    className="
                    font-black text-lg mt-1
                  "
                  >
                    ₹{item.price}
                  </p>

                  <p
                    className="
                    text-xs text-gray-500 mt-1
                  "
                  >
                    Quantity: {item.qty}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(item._id)
                    }

                    className="
                    mt-3 text-red-500 text-sm

                    hover:text-red-600

                    transition
                  "
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div
          className="
          border-t border-gray-200

          p-6

          bg-white/90
        "
        >

          <div
            className="
            flex items-center justify-between

            mb-5
          "
          >

            <span className="text-gray-500">
              Total
            </span>

            <span
              className="
              text-3xl font-black text-black
            "
            >
              ₹{total}
            </span>
          </div>

          <button
            onClick={() => {

              setShowCartDrawer(false);

              navigateWithLoading("/cart");
            }}

            className="
            w-full py-4 rounded-2xl

            bg-gradient-to-r
            from-black to-gray-800

            text-white font-semibold
            text-lg

            shadow-xl shadow-black/20

            hover:scale-[1.02]

            transition-all duration-300
          "
          >
            Open Full Cart →
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;