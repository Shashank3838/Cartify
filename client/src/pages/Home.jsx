import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q") || "";

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const approvedProducts = data.filter(
          (p) => p.isApproved === true || p.isApproved === undefined
        );
        setProducts(approvedProducts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  const toggleWishlist = (product) => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = stored.find((item) => item._id === product._id);

    let updated;

    if (exists) {
      updated = stored.filter((item) => item._id !== product._id);
    } else {
      updated = [...stored, product];
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(updated);
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= Number(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= Number(maxPrice)
    );
  }

  if (sort === "low") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "high") filteredProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-6">

      <h2 className="text-2xl font-bold mb-4 tracking-wide">
        {query ? `Search Results for "${query}" 🔍` : "Trending Products 🚀"}
      </h2>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm w-28"
        />

        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm w-28"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">Sort</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>

        <button
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            setSort("");
          }}
          className="text-sm px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow animate-pulse"
            >
              <div className="h-40 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">
          {query ? "No matching products found" : "No products available"}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="relative group bg-white rounded-2xl overflow-hidden
              shadow-md hover:shadow-xl transition-all duration-300
              hover:-translate-y-1 flex flex-col cursor-pointer"
            >

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(p);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 text-xl z-10 
                hover:scale-125 transition duration-200"
              >
                {isWishlisted(p._id) ? "❤️" : "🤍"}
              </button>

              <div className="h-44 w-full overflow-hidden">
                <img
                  src={p.image || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="h-full w-full object-cover 
                  transition-transform duration-500 
                  group-hover:scale-110"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3
                  className="font-semibold text-sm text-gray-800 leading-tight overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    minHeight: "40px",
                  }}
                >
                  {p.name}
                </h3>

                <p className="text-lg font-bold text-gray-900 mt-3">
                  ₹{p.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  className="mt-auto w-full py-2 rounded-xl
                  bg-black text-white text-sm font-medium
                  hover:scale-[1.03] hover:shadow-md
                  active:scale-95
                  transition-all duration-200"
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;