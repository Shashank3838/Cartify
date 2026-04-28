import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // 🔥 SAFETY FIX (handles old + new products)
        const approvedProducts = data.filter(
          (p) => p.isApproved === true || p.isApproved === undefined
        );

        setProducts(approvedProducts);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-6">
      <h2 className="text-2xl font-bold mb-6">
        Trending Products 🚀
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products available</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              {/* IMAGE */}
              <img
                src={p.image || "https://via.placeholder.com/300"}
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-4"
              />

              {/* NAME */}
              <h3 className="font-semibold text-sm line-clamp-2">
                {p.name}
              </h3>

              {/* PRICE */}
              <p className="text-lg font-bold mt-2 text-black">
                ₹{p.price}
              </p>

              {/* BUTTON */}
              <button
                onClick={() => addToCart(p)}
                className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                Add to Cart 🛒
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;