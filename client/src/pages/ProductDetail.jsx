import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  // ⭐ STATES
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // 🔥 LOAD REVIEWS FROM STORAGE
    const stored = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(stored);
  }, [id]);

  // ⭐ ADD REVIEW
  const handleAddReview = () => {
    if (!rating || !reviewText.trim()) {
      alert("Please add rating and review");
      return;
    }

    const newReview = {
      rating,
      text: reviewText,
      date: new Date().toLocaleDateString(),
    };

    const updated = [newReview, ...reviews];

    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));

    setRating(0);
    setReviewText("");
  };

  // ⭐ AVG RATING
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-gray-50 rounded-2xl p-4 shadow-inner">
            <img
              src={product.image || "https://via.placeholder.com/500"}
              alt={product.name}
              className="w-full h-[380px] object-contain rounded-xl 
              transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="text-2xl font-bold mt-4">
              ₹{product.price}
            </p>

            {/* ⭐ AVG RATING */}
            <div className="mt-3 text-yellow-500 text-lg">
              {"⭐".repeat(Math.round(avgRating))}
              <span className="text-gray-700 text-sm ml-2">
                ({avgRating}) • {reviews.length} reviews
              </span>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-700 text-sm">
                {product.description || "No description available"}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => addToCart(product)}
              className="w-full py-3 rounded-xl
              bg-black text-white hover:scale-[1.02]
              transition"
            >
              Add to Cart 🛒
            </button>

            <button className="w-full py-3 rounded-xl bg-gray-200">
              Buy Now ⚡
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ REVIEW SECTION */}
      <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          ⭐ Ratings & Reviews
        </h2>

        {/* ⭐ SELECT RATING */}
        <div className="flex gap-2 text-2xl mb-3 cursor-pointer">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => setRating(num)}
              className={num <= rating ? "text-yellow-500" : "text-gray-300"}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* ✍️ INPUT */}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="w-full border p-3 rounded-lg text-sm"
        />

        <button
          onClick={handleAddReview}
          className="mt-3 px-5 py-2 bg-black text-white rounded-lg"
        >
          Submit Review
        </button>

        {/* 🧾 REVIEWS LIST */}
        <div className="mt-6 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="border-b pb-3">
                <div className="text-yellow-500">
                  {"⭐".repeat(r.rating)}
                </div>
                <p className="text-sm text-gray-700 mt-1">{r.text}</p>
                <p className="text-xs text-gray-400 mt-1">{r.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;