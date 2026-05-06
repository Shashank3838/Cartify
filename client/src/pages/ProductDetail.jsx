import { useParams } from "react-router-dom";
import {
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";

import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const [quantity, setQuantity] = useState(1);

  // 🔥 SIMILAR PRODUCTS
  const [allProducts, setAllProducts] = useState([]);

  const similarRef = useRef(null);

  useEffect(() => {
    // 🔥 AUTO SCROLL TOP
    window.scrollTo(0, 0);

    setLoading(true);

    // PRODUCT
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // ALL PRODUCTS
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error(err));

    const stored =
      JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];

    setReviews(stored);
  }, [id]);

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

    localStorage.setItem(
      `reviews_${id}`,
      JSON.stringify(updated)
    );

    setRating(0);
    setReviewText("");
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // 🔥 SIMILAR PRODUCTS
  const similarProducts = allProducts
    .filter((p) => p._id !== product?._id)
    .slice(0, 8);

  const scrollSimilar = (direction) => {
    if (!similarRef.current) return;

    similarRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] px-6 py-10">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="h-[500px] rounded-3xl bg-gray-200"></div>

            <div className="space-y-5">
              <div className="h-10 w-72 bg-gray-200 rounded-xl"></div>

              <div className="h-8 w-40 bg-gray-200 rounded-xl"></div>

              <div className="h-32 bg-gray-200 rounded-2xl"></div>

              <div className="h-14 bg-gray-200 rounded-2xl"></div>

              <div className="h-14 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 sm:px-6 py-10">

      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT IMAGE */}
          <div
            className="bg-white rounded-[35px]
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            p-6 relative overflow-hidden
            border border-white/60 backdrop-blur-xl"
          >

            {/* BADGES */}
            <div className="absolute top-5 left-5 flex gap-2 z-20">

              <span
                className="bg-black text-white text-xs
                px-4 py-2 rounded-full font-semibold"
              >
                PREMIUM
              </span>

              <span
                className="bg-blue-100 text-blue-600 text-xs
                px-4 py-2 rounded-full font-semibold"
              >
                TRENDING
              </span>
            </div>

            {/* WISHLIST */}
            <div
              className="absolute top-5 right-5 z-20
              text-3xl cursor-pointer
              hover:scale-110 transition"
            >
              🤍
            </div>

            {/* IMAGE WRAPPER */}
            <div
              className="relative group
              bg-gradient-to-br from-gray-50 to-gray-100
              rounded-[30px] p-10
              overflow-hidden"
            >

              {/* GLOW */}
              <div
                className="absolute inset-0
                bg-gradient-to-br
                from-blue-500/10 via-transparent to-black/10
                opacity-0 group-hover:opacity-100
                transition duration-700"
              />

              {/* IMAGE */}
              <img
                src={
                  product.image ||
                  "https://via.placeholder.com/500"
                }
                alt={product.name}
                className="w-full max-h-[520px]
                object-contain
                transition duration-700
                group-hover:scale-110
                drop-shadow-2xl"
              />

              {/* FLOATING BADGE */}
              <div
                className="absolute bottom-5 left-1/2
                -translate-x-1/2
                opacity-0 group-hover:opacity-100
                transition duration-500"
              >
                <div
                  className="bg-white/90 backdrop-blur-xl
                  px-5 py-2 rounded-full shadow-2xl
                  text-sm font-semibold"
                >
                  Premium Product ✨
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col gap-6">

            <div
              className="bg-white rounded-[35px]
              shadow-[0_20px_60px_rgba(0,0,0,0.08)]
              p-8 border border-white/60 backdrop-blur-xl"
            >

              {/* STOCK */}
              <div className="flex items-center gap-3 mb-5">

                <span className="text-green-600 font-semibold text-sm">
                  ● In Stock
                </span>

                <span className="text-gray-400 text-sm">
                  Free Delivery 🚚
                </span>
              </div>

              {/* TITLE */}
              <h1
                className="text-4xl md:text-5xl
                font-black text-gray-900 leading-tight"
              >
                {product.name}
              </h1>

              {/* RATINGS */}
              <div className="flex items-center gap-3 mt-5">

                <div className="text-yellow-500 text-xl">
                  ⭐⭐⭐⭐⭐
                </div>

                <p className="text-gray-500">
                  ({avgRating}) • {reviews.length} reviews
                </p>
              </div>

              {/* PRICE */}
              <div className="mt-8 flex items-end gap-4">

                <h2 className="text-5xl font-black text-black">
                  ₹{product.price}
                </h2>

                <span
                  className="text-gray-400
                  line-through text-xl"
                >
                  ₹{Math.floor(product.price * 1.25)}
                </span>
              </div>

              <p className="mt-3 text-green-600 font-bold">
                25% OFF Limited Deal 🔥
              </p>

              {/* DESCRIPTION */}
              <div
                className="mt-8 bg-[#f7f9fc]
                rounded-[30px] p-6
                border border-gray-100"
              >

                <h3 className="font-black text-lg mb-3">
                  Product Description
                </h3>

                <p className="text-gray-600 leading-8">
                  {product.description ||
                    "No description available"}
                </p>
              </div>

              {/* QUANTITY */}
              <div className="mt-8">

                <h3 className="font-bold mb-4">
                  Quantity
                </h3>

                <div className="flex items-center gap-4">

                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        prev > 1 ? prev - 1 : 1
                      )
                    }
                    className="w-12 h-12 rounded-2xl
                    bg-gray-100 text-xl
                    hover:bg-gray-200 transition"
                  >
                    −
                  </button>

                  <span
                    className="text-2xl font-black
                    w-10 text-center"
                  >
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((prev) => prev + 1)
                    }
                    className="w-12 h-12 rounded-2xl
                    bg-gray-100 text-xl
                    hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-10 grid sm:grid-cols-2 gap-5">

                <button
                  onClick={() => addToCart(product)}
                  className="group relative overflow-hidden
                  bg-black text-white py-5 rounded-3xl
                  font-bold text-lg
                  hover:scale-[1.03]
                  active:scale-95
                  transition-all duration-300
                  shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                >

                  <div
                    className="absolute inset-0
                    bg-gradient-to-r from-gray-800 to-black
                    opacity-0 group-hover:opacity-100
                    transition duration-500"
                  />

                  <span className="relative z-10">
                    Add to Cart 🛒
                  </span>
                </button>

                <button
                  className="group relative overflow-hidden
                  bg-white border-2 border-black
                  py-5 rounded-3xl
                  font-bold text-lg
                  hover:bg-black hover:text-white
                  hover:scale-[1.03]
                  active:scale-95
                  transition-all duration-300"
                >

                  <div
                    className="absolute inset-0
                    bg-black translate-y-full
                    group-hover:translate-y-0
                    transition duration-500"
                  />

                  <span className="relative z-10">
                    Buy Now ⚡
                  </span>
                </button>
              </div>
            </div>

            {/* DELIVERY CARDS */}
            <div className="grid sm:grid-cols-3 gap-5">

              {[
                {
                  icon: "🚚",
                  title: "Free Shipping",
                  desc: "On all premium orders",
                },
                {
                  icon: "🔒",
                  title: "Secure Payment",
                  desc: "100% encrypted checkout",
                },
                {
                  icon: "↩️",
                  title: "Easy Returns",
                  desc: "7 day return policy",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white/80
                  backdrop-blur-xl
                  rounded-[28px] p-6
                  shadow-lg border border-white/60
                  hover:-translate-y-2
                  hover:shadow-2xl
                  transition-all duration-500"
                >

                  <div
                    className="text-4xl mb-4
                    group-hover:scale-110 transition"
                  >
                    {item.icon}
                  </div>

                  <h3 className="font-black text-lg">
                    {item.title}
                  </h3>

                  <p
                    className="text-sm text-gray-500
                    mt-2 leading-6"
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REVIEW SECTION */}
        <div
          className="mt-14 bg-white rounded-[35px]
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          p-8 border border-white/60"
        >

          {/* TOP */}
          <div
            className="flex flex-col md:flex-row
            md:items-center md:justify-between gap-4"
          >

            <div>
              <h2 className="text-3xl font-black">
                Ratings & Reviews ⭐
              </h2>

              <p className="text-gray-500 mt-2">
                Share your experience about this product
              </p>
            </div>

            <div
              className="bg-black text-white
              px-6 py-4 rounded-3xl"
            >
              <span className="text-3xl font-black">
                {avgRating}
              </span>

              <span className="ml-2 text-gray-300">
                / 5 Rating
              </span>
            </div>
          </div>

          {/* ADD REVIEW */}
          <div
            className="mt-10 bg-[#f7f9fc]
            rounded-[30px] p-6"
          >

            <h3 className="font-black text-xl mb-5">
              Write a Review
            </h3>

            <div
              className="flex gap-2 text-3xl
              mb-5 cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  onClick={() => setRating(num)}
                  className={
                    num <= rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                >
                  ⭐
                </span>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) =>
                setReviewText(e.target.value)
              }
              placeholder="Write your review..."
              className="w-full border border-gray-200
              p-5 rounded-3xl text-sm outline-none
              focus:ring-2 focus:ring-black
              resize-none"
              rows={5}
            />

            <button
              onClick={handleAddReview}
              className="mt-5 bg-black text-white
              px-8 py-4 rounded-3xl font-semibold
              hover:scale-[1.02] transition"
            >
              Submit Review 🚀
            </button>
          </div>

          {/* REVIEW LIST */}
          <div className="mt-10 space-y-6">

            {reviews.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No reviews yet 😭
              </div>
            ) : (
              reviews.map((r, i) => (
                <div
                  key={i}
                  className="bg-[#f7f9fc]
                  rounded-[30px] p-6
                  border border-gray-100"
                >

                  <div
                    className="flex items-center
                    justify-between"
                  >

                    <div className="text-yellow-500 text-lg">
                      {"⭐".repeat(r.rating)}
                    </div>

                    <p className="text-sm text-gray-400">
                      {r.date}
                    </p>
                  </div>

                  <p
                    className="text-gray-700
                    mt-4 leading-8"
                  >
                    {r.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🔥 SIMILAR PRODUCTS */}
        <div className="mt-20">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-4xl font-black text-gray-900">
                You May Also Like ✨
              </h2>

              <p className="text-gray-500 mt-2">
                Handpicked premium products for you
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => scrollSimilar("left")}
                className="w-14 h-14 rounded-full
                bg-white shadow-xl
                hover:scale-110 transition"
              >
                ←
              </button>

              <button
                onClick={() => scrollSimilar("right")}
                className="w-14 h-14 rounded-full
                bg-white shadow-xl
                hover:scale-110 transition"
              >
                →
              </button>
            </div>
          </div>

          {/* PRODUCTS */}
          <div
            ref={similarRef}
            className="flex gap-8 overflow-x-auto
            scroll-smooth no-scrollbar pb-4"
          >

            {similarProducts.map((p) => (
              <div
                key={p._id}
                onClick={() =>
                  window.location.href = `/product/${p._id}`
                }
                className="group min-w-[300px]
                max-w-[300px]
                bg-white rounded-[32px]
                overflow-hidden cursor-pointer
                shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.16)]
                hover:-translate-y-3
                transition-all duration-700"
              >

                {/* IMAGE */}
                <div
                  className="relative h-72 overflow-hidden
                  bg-gradient-to-br
                  from-gray-100 to-gray-200"
                >

                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover
                    group-hover:scale-110
                    transition duration-1000"
                  />

                  <div
                    className="absolute inset-0 bg-black/0
                    group-hover:bg-black/10
                    transition"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">

                  <div className="flex items-center gap-1 text-sm mb-3">
                    ⭐⭐⭐⭐⭐

                    <span className="text-gray-500">
                      (4.9)
                    </span>
                  </div>

                  <h3
                    className="font-bold text-xl
                    text-gray-900 leading-snug"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "60px",
                    }}
                  >
                    {p.name}
                  </h3>

                  <div className="mt-4 flex items-end gap-2">

                    <p className="text-3xl font-black">
                      ₹{p.price}
                    </p>

                    <span
                      className="text-gray-400
                      line-through text-sm mb-1"
                    >
                      ₹{Math.floor(p.price * 1.2)}
                    </span>
                  </div>

                  <button
                    className="mt-6 w-full py-4
                    rounded-2xl bg-black text-white
                    font-bold hover:scale-[1.02]
                    transition"
                  >
                    View Product 👀
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;