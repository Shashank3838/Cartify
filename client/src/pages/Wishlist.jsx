import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-6">
      <h2 className="text-2xl font-bold mb-6">❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500">No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="relative bg-white rounded-2xl overflow-hidden
              shadow-md hover:shadow-xl transition-all duration-300
              hover:-translate-y-1 flex flex-col cursor-pointer"
            >

              {/* ❌ REMOVE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(p._id);
                }}
                className="absolute top-2 right-2 text-red-500 text-lg"
              >
                ❌
              </button>

              {/* IMAGE */}
              <div className="h-44 w-full overflow-hidden">
                <img
                  src={p.image || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-sm text-gray-800">
                  {p.name}
                </h3>

                <p className="text-lg font-bold mt-2">
                  ₹{p.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  className="mt-auto w-full py-2 rounded-xl
                  bg-black text-white text-sm
                  hover:scale-[1.03] transition"
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

export default Wishlist;