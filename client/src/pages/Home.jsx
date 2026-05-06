import {
  useEffect,
  useState,
  useContext,
  useMemo,
  useRef,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { CartContext } from "../context/CartContext";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  const query =
    new URLSearchParams(location.search).get("q") || "";

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [wishlist, setWishlist] = useState([]);

  // 🔥 SLIDER REFS
  const trendingRef = useRef(null);
  const recentRef = useRef(null);
  const featuredRef = useRef(null);

  useEffect(() => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    const stored =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(stored);
  }, []);

  const toggleWishlist = (product) => {
    const stored =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = stored.find(
      (item) => item._id === product._id
    );

    let updated;

    if (exists) {
      updated = stored.filter(
        (item) => item._id !== product._id
      );
    } else {
      updated = [...stored, product];
    }

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );

    setWishlist(updated);
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  // 🔥 SLIDER SCROLL
  const scroll = (ref, direction) => {
    if (!ref.current) return;

    const amount = 420;

    ref.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (minPrice) {
      filtered = filtered.filter(
        (p) => p.price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (p) => p.price <= Number(maxPrice)
      );
    }

    if (sort === "low") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, query, minPrice, maxPrice, sort]);

  const trendingProducts = filteredProducts;

  const recentlyAdded = [...filteredProducts].reverse();

  const featuredProducts = [...filteredProducts].sort(
    () => 0.5 - Math.random()
  );

  // 🔥 PRODUCT RENDER
  const renderProducts = (items, sliderRef) => (
    <div className="relative">

      {/* LEFT BUTTON */}
      <button
        onClick={() => scroll(sliderRef, "left")}
        className="absolute left-[-18px] top-1/2
        -translate-y-1/2 z-20
        w-14 h-14 rounded-full
        bg-white/90 backdrop-blur-xl
        shadow-2xl border border-white/60
        hover:scale-110 transition-all"
      >
        ←
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => scroll(sliderRef, "right")}
        className="absolute right-[-18px] top-1/2
        -translate-y-1/2 z-20
        w-14 h-14 rounded-full
        bg-white/90 backdrop-blur-xl
        shadow-2xl border border-white/60
        hover:scale-110 transition-all"
      >
        →
      </button>

      {/* PRODUCTS */}
      <div
        ref={sliderRef}
        className="flex gap-8 overflow-x-auto
        scroll-smooth pb-4 no-scrollbar"
      >

        {items.map((p) => (
          <div
            key={p._id}
            onClick={() =>
              navigate(`/product/${p._id}`)
            }
            className="group min-w-[320px] max-w-[320px]
            relative overflow-hidden rounded-[34px]
            bg-white/95 backdrop-blur-2xl
            border border-white/60
            shadow-[0_10px_40px_rgba(0,0,0,0.08)]
            hover:shadow-[0_25px_70px_rgba(0,0,0,0.18)]
            transition-all duration-700
            hover:-translate-y-4 cursor-pointer"
          >

            {/* HOVER GLOW */}
            <div
              className="absolute inset-0 opacity-0
              group-hover:opacity-100
              transition duration-700
              bg-gradient-to-br
              from-blue-500/5 via-transparent to-black/5
              pointer-events-none z-0"
            />

            {/* BADGES */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">

              <span
                className="bg-black text-white text-[11px]
                px-3 py-1 rounded-full
                font-semibold tracking-wide"
              >
                PREMIUM
              </span>

              <span
                className="bg-blue-100 text-blue-700
                text-[11px] px-3 py-1 rounded-full
                font-semibold"
              >
                TRENDING
              </span>
            </div>

            {/* WISHLIST */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(p);
              }}
              onMouseDown={(e) =>
                e.stopPropagation()
              }
              className="absolute top-4 right-4 z-20
              w-11 h-11 rounded-full
              bg-white/90 backdrop-blur-md
              shadow-lg flex items-center justify-center
              text-xl hover:scale-110 transition"
            >
              {isWishlisted(p._id)
                ? "❤️"
                : "🤍"}
            </button>

            {/* IMAGE */}
            <div
              className="relative h-80 overflow-hidden
              bg-gradient-to-br
              from-gray-100 to-gray-200"
            >

              <img
                src={
                  p.image ||
                  "https://via.placeholder.com/300"
                }
                alt={p.name}
                className="h-full w-full object-cover
                transition-transform duration-1000
                group-hover:scale-110"
              />

              {/* OVERLAY */}
              <div
                className="absolute inset-0 bg-black/0
                group-hover:bg-black/10
                transition duration-500"
              />

              {/* QUICK VIEW */}
              <div
                className="absolute inset-0
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition-all duration-500"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/product/${p._id}`);
                  }}
                  className="px-6 py-3 rounded-full
                  bg-white/90 backdrop-blur-xl
                  text-black font-bold
                  shadow-2xl hover:scale-105
                  transition"
                >
                  Quick View 👀
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col relative z-10">

              {/* STARS */}
              <div
                className="flex items-center gap-1
                mb-3 text-sm"
              >
                ⭐⭐⭐⭐⭐

                <span
                  className="text-gray-500
                  text-xs ml-1"
                >
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

              <div
                className="mt-4 flex items-end gap-2"
              >

                <p
                  className="text-4xl font-black
                  text-black"
                >
                  ₹{p.price}
                </p>

                <span
                  className="text-gray-400
                  line-through text-sm mb-2"
                >
                  ₹{Math.floor(p.price * 1.25)}
                </span>
              </div>

              <p
                className="text-sm text-green-600
                font-semibold mt-2"
              >
                Free Delivery 🚚
              </p>

              {/* ADD TO CART */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                className="mt-6 w-full py-4 rounded-2xl
                bg-black text-white
                font-bold tracking-wide
                hover:bg-gray-900
                hover:scale-[1.02]
                active:scale-95
                transition-all duration-300"
              >
                Add to Cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen px-6 py-6
      bg-[#f5f5f7]"
    >

      {/* LOADING */}
      {loading ? (

        <div className="space-y-16 animate-pulse">

          {/* HERO SKELETON */}
          {!query && (
            <div
              className="rounded-[42px]
              bg-gradient-to-br
              from-gray-200 via-gray-100 to-gray-200
              h-[420px] relative overflow-hidden"
            >

              <div
                className="absolute inset-0
                -translate-x-full
                animate-[shimmer_2s_infinite]
                bg-gradient-to-r
                from-transparent
                via-white/60
                to-transparent"
              />
            </div>
          )}

          {/* FILTER BAR */}
          <div
            className="h-28 rounded-[30px]
            bg-white/70 shadow-lg"
          />

          {/* TITLE */}
          <div
            className="h-12 w-80
            rounded-2xl bg-gray-200"
          />

          {/* PRODUCT SKELETONS */}
          <div className="flex gap-8 overflow-hidden">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-w-[320px]
                rounded-[34px]
                overflow-hidden
                bg-white shadow-xl"
              >

                <div
                  className="h-80 bg-gradient-to-br
                  from-gray-200 via-gray-100 to-gray-200
                  relative overflow-hidden"
                >

                  <div
                    className="absolute inset-0
                    -translate-x-full
                    animate-[shimmer_2s_infinite]
                    bg-gradient-to-r
                    from-transparent
                    via-white/70
                    to-transparent"
                  />
                </div>

                <div className="p-6 space-y-5">

                  <div
                    className="h-4 w-24
                    rounded-full bg-gray-200"
                  />

                  <div
                    className="h-8 w-full
                    rounded-xl bg-gray-200"
                  />

                  <div
                    className="h-8 w-40
                    rounded-xl bg-gray-200"
                  />

                  <div
                    className="h-14 w-full
                    rounded-2xl bg-gray-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      ) : (
        <>
          {/* HERO */}
          {!query && (
            <section
              className="relative overflow-hidden
              rounded-[42px]
              bg-gradient-to-br
              from-black via-gray-900 to-blue-950
              px-10 md:px-20 py-24 mb-16
              shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            >

              <div
                className="absolute top-0 right-0
                w-[500px] h-[500px]
                bg-blue-500/20 blur-[120px]
                rounded-full"
              />

              <div
                className="absolute bottom-0 left-0
                w-[300px] h-[300px]
                bg-white/10 blur-[100px]
                rounded-full"
              />

              <div className="relative z-10 max-w-4xl">

                <p
                  className="uppercase tracking-[8px]
                  text-sm text-gray-400
                  mb-8 font-semibold"
                >
                  Premium Ecommerce Experience
                </p>

                <h1
                  className="text-6xl md:text-8xl
                  font-black leading-none text-white"
                >
                  Discover
                </h1>

                <h1
                  className="text-6xl md:text-8xl
                  font-black leading-none
                  text-gray-300 mt-2"
                >
                  Premium Products ✨
                </h1>

                <p
                  className="text-gray-300 text-xl
                  leading-relaxed mt-10 max-w-2xl"
                >
                  Shop trending gadgets, fashion,
                  accessories and lifestyle products
                  with a modern luxury experience.
                </p>

                <div
                  className="flex flex-wrap gap-5 mt-12"
                >

                  <button
                    onClick={() => {
                      window.scrollTo({
                        top: 850,
                        behavior: "smooth",
                      });
                    }}
                    className="bg-white text-black
                    px-10 py-5 rounded-2xl
                    font-bold text-lg
                    hover:scale-105 transition-all"
                  >
                    Shop Now 🚀
                  </button>

                  <button
                    className="border border-white/20
                    bg-white/5 backdrop-blur-md
                    text-white px-10 py-5
                    rounded-2xl font-semibold
                    text-lg hover:bg-white
                    hover:text-black transition-all"
                  >
                    Explore Trends 🔥
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TITLE */}
          <h2
            className="text-4xl font-black mb-8
            tracking-tight text-gray-900"
          >
            {query
              ? `Search Results for "${query}" 🔍`
              : "Discover Products ✨"}
          </h2>

          {/* FILTERS */}
          <div
            className="bg-white/80 backdrop-blur-xl
            border border-gray-200 p-6
            rounded-[30px] shadow-lg mb-16
            flex flex-wrap gap-4 items-center"
          >

            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(e.target.value)
              }
              className="border border-gray-200
              px-5 py-4 rounded-2xl
              text-sm w-36 outline-none
              focus:ring-2 focus:ring-black"
            />

            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value)
              }
              className="border border-gray-200
              px-5 py-4 rounded-2xl
              text-sm w-36 outline-none
              focus:ring-2 focus:ring-black"
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="border border-gray-200
              px-5 py-4 rounded-2xl
              text-sm outline-none"
            >
              <option value="">
                Sort Products
              </option>

              <option value="low">
                Price: Low → High
              </option>

              <option value="high">
                Price: High → Low
              </option>
            </select>

            <button
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                setSort("");
              }}
              className="bg-black text-white
              px-7 py-4 rounded-2xl
              font-semibold hover:scale-105
              transition"
            >
              Reset Filters
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 text-lg">
              {query
                ? "No matching products found"
                : "No products available"}
            </p>
          ) : query ? (
            <section className="pb-10">
              {renderProducts(
                filteredProducts,
                trendingRef
              )}
            </section>
          ) : (
            <>
              {/* TRENDING */}
              <section className="mb-24">

                <div
                  className="flex items-center
                  justify-between mb-8"
                >

                  <h3
                    className="text-4xl font-black
                    text-gray-900"
                  >
                    🔥 Trending Right Now
                  </h3>

                  <p
                    className="text-gray-500
                    font-medium"
                  >
                    Swipe Products →
                  </p>
                </div>

                {renderProducts(
                  trendingProducts,
                  trendingRef
                )}
              </section>

              {/* RECENT */}
              <section className="mb-24">

                <div
                  className="flex items-center
                  justify-between mb-8"
                >

                  <h3
                    className="text-4xl font-black
                    text-gray-900"
                  >
                    🆕 Fresh Arrivals
                  </h3>

                  <p
                    className="text-gray-500
                    font-medium"
                  >
                    Explore More →
                  </p>
                </div>

                {renderProducts(
                  recentlyAdded,
                  recentRef
                )}
              </section>

              {/* FEATURED */}
              <section className="pb-16">

                <div
                  className="flex items-center
                  justify-between mb-8"
                >

                  <h3
                    className="text-4xl font-black
                    text-gray-900"
                  >
                    ⭐ Editor’s Picks
                  </h3>

                  <p
                    className="text-gray-500
                    font-medium"
                  >
                    Curated For You →
                  </p>
                </div>

                {renderProducts(
                  featuredProducts,
                  featuredRef
                )}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;