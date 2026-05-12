import {
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { CartContext } from "../context/CartContext";

function CategoryPage() {

  const { categoryName } = useParams();

  const navigate = useNavigate();

  const { addToCart } =
    useContext(CartContext);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [sort, setSort] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  // 🔥 CATEGORY THEMES
  const categoryThemes = {

    Gaming: {
      bg:
        "from-purple-900 via-black to-fuchsia-900",

      glow: "bg-fuchsia-500/20",

      subtitle:
        "Next-gen gaming gear & immersive setups",

      emoji: "🎮",
    },

    Fashion: {
      bg:
        "from-[#f3e7d3] via-[#e7d4c0] to-[#d8c1a7]",

      glow: "bg-orange-300/20",

      subtitle:
        "Luxury fashion curated for modern aesthetics",

      emoji: "👗",
    },

    Accessories: {
      bg:
        "from-gray-900 via-black to-gray-800",

      glow: "bg-white/10",

      subtitle:
        "Premium accessories that elevate your style",

      emoji: "🕶️",
    },

    Sports: {
      bg:
        "from-green-900 via-black to-lime-900",

      glow: "bg-lime-400/20",

      subtitle:
        "Elite performance gear for athletes & fitness",

      emoji: "🏀",
    },

    Toys: {
      bg:
        "from-pink-500 via-red-400 to-yellow-400",

      glow: "bg-white/20",

      subtitle:
        "Fun collectibles & playful premium toys",

      emoji: "🧸",
    },

    Electronics: {
      bg:
        "from-slate-900 via-blue-950 to-black",

      glow: "bg-cyan-400/20",

      subtitle:
        "Future-ready gadgets & smart electronics",

      emoji: "📱",
    },

    Beauty: {
      bg:
        "from-pink-200 via-rose-100 to-pink-300",

      glow: "bg-pink-400/20",

      subtitle:
        "Luxury beauty essentials & skincare",

      emoji: "✨",
    },

    Sneakers: {
      bg:
        "from-red-900 via-black to-orange-700",

      glow: "bg-red-500/20",

      subtitle:
        "Streetwear sneakers & iconic footwear",

      emoji: "👟",
    },

    Other: {
      bg:
        "from-gray-800 via-black to-gray-700",

      glow: "bg-white/10",

      subtitle:
        "Explore curated premium products",

      emoji: "🛍️",
    },
  };

  const currentTheme =
    categoryThemes[categoryName] ||
    categoryThemes.Other;

  useEffect(() => {

    setLoading(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/api/products`
    )
      .then((res) => res.json())

      .then((data) => {

        const filtered = data.filter(
          (p) =>
            p.category?.toLowerCase() ===
            categoryName.toLowerCase()
        );

        setProducts(filtered);
      })

      .catch((err) =>
        console.error(err)
      )

      .finally(() =>
        setLoading(false)
      );

  }, [categoryName]);

  const filteredProducts =
    useMemo(() => {

      let filtered = [...products];

      if (minPrice) {

        filtered = filtered.filter(
          (p) =>
            p.price >= Number(minPrice)
        );
      }

      if (maxPrice) {

        filtered = filtered.filter(
          (p) =>
            p.price <= Number(maxPrice)
        );
      }

      if (sort === "low") {

        filtered.sort(
          (a, b) =>
            a.price - b.price
        );
      }

      if (sort === "high") {

        filtered.sort(
          (a, b) =>
            b.price - a.price
        );
      }

      return filtered;

    }, [
      products,
      sort,
      minPrice,
      maxPrice,
    ]);

  return (

    <div
      className="
      min-h-screen
      bg-[#f5f5f7]

      px-6 md:px-10

      py-10
    "
    >

      {/* HERO */}
      <section
        className={`
        relative overflow-hidden

        rounded-[45px]

        bg-gradient-to-br ${currentTheme.bg}

        px-10 py-24

        mb-14

        shadow-[0_20px_80px_rgba(0,0,0,0.3)]
      `}
      >

        {/* GLOW */}
        <div
          className={`
          absolute top-[-120px]
          right-[-100px]

          w-[420px]
          h-[420px]

          rounded-full

          ${currentTheme.glow}

          blur-[120px]
        `}
        />

        {/* FLOATING ORB */}
        <div
          className="
          absolute bottom-[-60px]
          left-[-60px]

          w-[250px]
          h-[250px]

          rounded-full

          bg-white/10

          blur-[90px]
        "
        />

        <div className="relative z-10">

          <div
            className="
            inline-flex items-center gap-3

            px-5 py-3

            rounded-full

            bg-white/10
            backdrop-blur-xl

            border border-white/10

            text-white

            mb-8
          "
          >

            <span className="text-2xl">
              {currentTheme.emoji}
            </span>

            <span className="font-semibold">
              Premium Collection
            </span>
          </div>

          <h1
            className="
            text-6xl md:text-8xl

            font-black

            text-white

            leading-none
          "
          >
            {categoryName}
          </h1>

          <p
            className="
            text-white/70

            mt-8

            text-xl

            max-w-2xl

            leading-9
          "
          >
            {currentTheme.subtitle}
          </p>

          <div
            className="
            flex flex-wrap gap-5

            mt-10
          "
          >

            <button
              className="
              px-8 py-4

              rounded-2xl

              bg-white text-black

              font-bold

              hover:scale-105

              transition-all duration-300
            "
            >
              Explore Now ✨
            </button>

            <button
              className="
              px-8 py-4

              rounded-2xl

              border border-white/20

              bg-white/10

              backdrop-blur-xl

              text-white

              font-semibold

              hover:bg-white/20

              transition-all duration-300
            "
            >
              Trending Products 🔥
            </button>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div
        className="
        bg-white/90 backdrop-blur-xl

        border border-white/50

        p-6 rounded-[30px]

        shadow-lg

        flex flex-wrap gap-4

        items-center

        mb-14
      "
      >

        <input
          type="number"

          placeholder="Min ₹"

          value={minPrice}

          onChange={(e) =>
            setMinPrice(e.target.value)
          }

          className="
          border border-gray-200

          px-5 py-4

          rounded-2xl

          outline-none

          focus:ring-2
          focus:ring-black
        "
        />

        <input
          type="number"

          placeholder="Max ₹"

          value={maxPrice}

          onChange={(e) =>
            setMaxPrice(e.target.value)
          }

          className="
          border border-gray-200

          px-5 py-4

          rounded-2xl

          outline-none

          focus:ring-2
          focus:ring-black
        "
        />

        <select
          value={sort}

          onChange={(e) =>
            setSort(e.target.value)
          }

          className="
          border border-gray-200

          px-5 py-4

          rounded-2xl

          outline-none
        "
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

            setSort("");

            setMinPrice("");

            setMaxPrice("");
          }}

          className="
          bg-black text-white

          px-7 py-4

          rounded-2xl

          font-semibold

          hover:scale-105

          transition-all
        "
        >
          Reset
        </button>
      </div>

      {/* LOADING */}
      {loading ? (

        <div
          className="
          text-center

          text-2xl

          font-bold

          py-20
        "
        >
          Loading Products...
        </div>

      ) : filteredProducts.length === 0 ? (

        <div
          className="
          text-center

          py-24
        "
        >

          <h2
            className="
            text-4xl font-black

            text-gray-800
          "
          >
            No Products Found 😭
          </h2>

          <p
            className="
            text-gray-500

            mt-4
          "
          >
            No products available in
            this category yet.
          </p>
        </div>

      ) : (

        <>

          {/* STATS */}
          <div
            className="
            flex flex-wrap gap-5

            mb-10
          "
          >

            <div
              className="
              px-6 py-4

              rounded-2xl

              bg-white

              shadow-lg

              font-bold
            "
            >
              {filteredProducts.length}
              + Products
            </div>

            <div
              className="
              px-6 py-4

              rounded-2xl

              bg-black text-white

              shadow-lg

              font-bold
            "
            >
              Premium Collection ✨
            </div>
          </div>

          {/* PRODUCTS */}
          <div
            className="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4

            gap-8
          "
          >

            {filteredProducts.map((p) => (

              <div
                key={p._id}

                onClick={() =>
                  navigate(
                    `/product/${p._id}`
                  )
                }

                className="
                group

                bg-white/90

                backdrop-blur-2xl

                border border-white/60

                rounded-[34px]

                overflow-hidden

                shadow-[0_10px_40px_rgba(0,0,0,0.08)]

                hover:shadow-[0_25px_70px_rgba(0,0,0,0.18)]

                hover:-translate-y-3

                transition-all duration-700

                cursor-pointer
              "
              >

                {/* IMAGE */}
                <div
                  className="
                  relative

                  h-80 overflow-hidden

                  bg-gradient-to-br
                  from-gray-100
                  to-gray-200
                "
                >

                  {/* BADGE */}
                  <div
                    className="
                    absolute top-4 left-4

                    z-20

                    px-4 py-2

                    rounded-full

                    bg-black text-white

                    text-sm font-bold
                  "
                  >
                    Trending 🔥
                  </div>

                  <img
                    src={
                      p.image ||
                      "https://via.placeholder.com/300"
                    }

                    alt={p.name}

                    className="
                    h-full w-full

                    object-cover

                    group-hover:scale-110

                    transition-transform duration-1000
                  "
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">

                  <p
                    className="
                    text-sm text-gray-500

                    uppercase tracking-wide

                    mb-3
                  "
                  >
                    {p.category}
                  </p>

                  <h3
                    className="
                    text-2xl font-black

                    text-gray-900

                    leading-snug
                  "
                  >
                    {p.name}
                  </h3>

                  <div
                    className="
                    flex items-end gap-3

                    mt-5
                  "
                  >

                    <p
                      className="
                      text-4xl font-black
                    "
                    >
                      ₹{p.price}
                    </p>

                    <span
                      className="
                      text-gray-400

                      line-through

                      mb-2
                    "
                    >
                      ₹
                      {Math.floor(
                        p.price * 1.2
                      )}
                    </span>
                  </div>

                  <div
                    className="
                    mt-3

                    text-sm text-orange-500

                    font-semibold
                  "
                  >
                    Only few left 😮‍💨
                  </div>

                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      addToCart(p);
                    }}

                    className="
                    mt-6 w-full

                    py-4 rounded-2xl

                    bg-black text-white

                    font-bold

                    hover:scale-[1.02]

                    transition-all
                  "
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryPage;