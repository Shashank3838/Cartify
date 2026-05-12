import { useState, useEffect, useRef } from "react";
import axios from "axios";
function SellerDashboard() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

const fileInputRef = useRef();
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(1);

  const [products, setProducts] = useState([]);

  const [sellerOrders, setSellerOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("products");

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({
      name: "",
      price: "",
      description: "",
      category: "",
    });

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    revenue: 0,
  });

  // =====================================
  // 🔥 FETCH SELLER ORDERS
  // =====================================
  const fetchSellerOrders = async () => {

    try {

      setOrdersLoading(true);
console.log(
  "🔥 FETCHING SELLER ORDERS..."
);
const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/orders/seller-orders`,
  {
    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("token"),
    },
  }
);
      const text = await res.text();

console.log("RAW RESPONSE:", text);

let data;

try {
  data = JSON.parse(text);
} catch (err) {
  console.log("❌ NOT JSON RESPONSE");
}
console.log(
  "🔥 SELLER ORDERS RESPONSE:",
  data
);
    setSellerOrders(
  Array.isArray(data)
    ? data
    : data.orders || []
);

    } catch (error) {

      console.error(
        "SELLER ORDERS ERROR:",
        error
      );

    } finally {

      setOrdersLoading(false);
    }
  };

  // =====================================
  // 🔥 FETCH PRODUCTS
  // =====================================
  const fetchMyProducts = async () => {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/my-products`,
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );

const data = await res.json();

const safeData = Array.isArray(data)
  ? data
  : [];

setProducts(safeData);

const approved = safeData.filter(
  (p) => p.status === "approved"
).length;

const pending = safeData.filter(
  (p) => p.status !== "approved"
).length;

const revenue = safeData.reduce(
  (acc, item) =>
    acc + Number(item.price || 0),
  0
);

setStats({
  total: safeData.length,
  approved,
  pending,
  revenue,
});
    };

  useEffect(() => {

    fetchMyProducts();

    fetchSellerOrders();

  }, []);

  // =====================================
  // 🔥 AUTO FETCH IMAGE
  // =====================================
  // =====================================
// 🔥 AUTO FETCH IMAGE
// =====================================
const fetchImage = async () => {

  if (!name) {

    alert("Enter product name first");

    return;
  }

  try {

    const res = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${name}&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`
    );

    const data = await res.json();

    if (data.results.length > 0) {

      const imageUrl =
        data.results[0].urls.regular;

      setImage(imageUrl);

    } else {

      alert("No image found");
    }

  } catch (err) {

    console.error(err);

    alert("Image fetch failed");
  }
};


  // =====================================
  // 🔥 ADD PRODUCT
  // =====================================
  // =====================================
// 🔥 ADD PRODUCT
// =====================================
const handleAddProduct = async (e) => {

  e.preventDefault();

  try {

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("stock", stock);

if (image instanceof File) {

  formData.append("image", image);

} else if (typeof image === "string") {

  formData.append("imageUrl", image);

}

const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/products`,
  {
    method: "POST",

    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("token"),
    },

    body: formData,
  }
);
      
    

    const data = await res.json();

    console.log("🔥 PRODUCT CREATED:", data);

    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
    setCategory("");
    setBrand("");
    setStock(1);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    fetchMyProducts();

  } catch (error) {

    console.log(
      "❌ PRODUCT CREATE ERROR:",
      error
    );
  }
};

  // =====================================
  // 🔥 DELETE PRODUCT
  // =====================================
  const handleDelete = async (id) => {

   await fetch(
  `${import.meta.env.VITE_API_URL}/api/products/${id}`,
  {
    method: "DELETE",

    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("token"),
    },
  }
);

fetchMyProducts();
  };

  // =====================================
  // 🔥 EDIT CLICK
  // =====================================
  const handleEditClick = (product) => {

    setEditingId(product._id);

    setEditData({
      name: product.name,
      price: product.price,
      description:
        product.description,
      category:
        product.category || "",
    });
  };

  // =====================================
  // 🔥 UPDATE PRODUCT
  // =====================================
  const handleUpdate = async (id) => {

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },

        body: JSON.stringify(editData),
      }
    );

    setEditingId(null);

    fetchMyProducts();
  };

  return (

    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div
          className="
          relative overflow-hidden

          rounded-[40px]

          bg-gradient-to-br
          from-black via-gray-900 to-blue-950

          px-10 py-16 mb-12
        "
        >

          <div className="relative z-10">

            <p
              className="
              uppercase tracking-[6px]

              text-sm text-gray-400

              font-semibold mb-5
            "
            >
              Seller Control Center
            </p>

            <h1
              className="
              text-5xl md:text-7xl

              font-black text-white
            "
            >
              Seller Dashboard 👑
            </h1>

            <p
              className="
              text-gray-300 text-lg

              mt-6 max-w-2xl leading-8
            "
            >
              Manage products and grow your
              ecommerce business with Cartify.
            </p>
          </div>
        </div>

        {/* ANALYTICS */}
        <div
          className="
          grid grid-cols-1
          sm:grid-cols-2 lg:grid-cols-5

          gap-6 mb-12
        "
        >

          {[
            {
              title: "Total Products",
              value: stats.total,
              icon: "📦",
            },

            {
              title: "Approved",
              value: stats.approved,
              icon: "✅",
            },

            {
              title: "Pending",
              value: stats.pending,
              icon: "⏳",
            },

            {
              title: "Revenue",
              value: `₹${stats.revenue}`,
              icon: "💰",
            },

            {
              title: "Orders",
              value: sellerOrders.length,
              icon: "🧾",
            },

          ].map((item, i) => (

            <div
              key={i}

              className="
              bg-white rounded-[30px]

              p-7 shadow-md
            "
            >

              <div
                className="
                flex items-center
                justify-between
              "
              >

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2
                    className="
                    text-4xl font-black
                    mt-3
                  "
                  >
                    {item.value}
                  </h2>
                </div>

                <div
                  className="
                  w-16 h-16 rounded-2xl

                  bg-black text-white

                  flex items-center
                  justify-center

                  text-3xl
                "
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div
          className="
          grid grid-cols-1
          lg:grid-cols-3

          gap-10 items-start
        "
        >

          {/* LEFT SIDE */}
          <div
            className="
            lg:sticky lg:top-28
            self-start
          "
          >

            <form
              onSubmit={handleAddProduct}

              className="
              bg-white rounded-[35px]

              p-8 shadow-md

              max-h-[85vh]
              overflow-y-auto
            "
            >

              <h2
                className="
                text-3xl font-black
                mb-8
              "
              >
                Add Product ✨
              </h2>

              <div className="space-y-5">

                <input
                  type="text"

                  placeholder="Product Name"

                  className="
                  w-full px-5 py-4

                  rounded-2xl border
                "

                  value={name}

                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

                <input
                  type="number"

                  placeholder="Price"

                  className="
                  w-full px-5 py-4

                  rounded-2xl border
                "

                  value={price}

                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                />

                <input
                  type="text"

                  placeholder="Brand"

                  className="
                  w-full px-5 py-4

                  rounded-2xl border
                "

                  value={brand}

                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                />

                <textarea
                  rows={5}

                  placeholder="Description"

                  className="
                  w-full px-5 py-4

                  rounded-2xl border
                "

                  value={description}

                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"

                  placeholder="Stock Quantity"

                  className="
                  w-full px-5 py-4

                  rounded-2xl border
                "

                  value={stock}

                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                />

                <select
                  className="
                  w-full px-5 py-4

                  rounded-2xl border
                "

                  value={category}

                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Fashion">
                    Fashion
                  </option>

                  <option value="Sneakers">
                    Sneakers
              
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

              
                  <option value="Beauty">
                    Beauty
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  
                  <option value="Toys">
                    Toys
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

<button
  type="button"

  onClick={fetchImage}

  className="
  w-full py-4

  rounded-2xl

  bg-blue-600 text-white

  font-semibold
"
>
  Auto Fetch Image ✨
</button>



                <div
  className="
  border-2 border-dashed
  border-gray-300

  rounded-[25px]

  p-8 text-center

  bg-gray-50
"
>

  <input
    type="file"

    accept="image/*"

    ref={fileInputRef}

    onChange={(e) =>
      setImage(e.target.files[0])
    }

    className="hidden"

    id="productImageUpload"
  />

  <label
    htmlFor="productImageUpload"

    className="
    cursor-pointer
    block
  "
  >

    <div className="text-5xl mb-4">
      📸
    </div>

    <h3
      className="
      text-xl font-black
    "
    >
      Upload Product Image
    </h3>

    <p
      className="
      text-gray-500 mt-2
    "
    >
      Drag & drop coming next 😎
    </p>

    <div
      className="
      mt-5 inline-block

      px-6 py-3

      rounded-2xl

      bg-black text-white
    "
    >
      Choose File
    </div>

  </label>

</div>

                {image && (

                  <img
  src={
  image instanceof File
    ? URL.createObjectURL(image)
    : image
}
                

                    alt="preview"

                    className="
                    w-full h-72

                    object-cover
                    rounded-[25px]
                  "
                  />
                )}

                <button
                  className="
                  w-full py-5

                  rounded-2xl

                  bg-black text-white

                  font-black
                "
                >
                  Add Product 🚀
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2">

            {/* TABS */}
            <div className="flex gap-4 mb-10">

              <button
                onClick={() =>
                  setActiveTab("products")
                }

                className={`
                  px-8 py-4 rounded-2xl
                  font-bold transition-all duration-300

                  ${
                    activeTab === "products"

                      ? `
                        bg-black text-white
                        shadow-xl
                      `

                      : `
                        bg-white text-black
                      `
                  }
                `}
              >
                Products 📦
              </button>

              <button
                onClick={() =>
                  setActiveTab("orders")
                }

                className={`
                  px-8 py-4 rounded-2xl
                  font-bold transition-all duration-300

                  ${
                    activeTab === "orders"

                      ? `
                        bg-black text-white
                        shadow-xl
                      `

                      : `
                        bg-white text-black
                      `
                  }
                `}
              >
                Orders 🧾
              </button>
            </div>

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (

              <div className="space-y-8">

                {products.map((p) => (

                  <div
                    key={p._id}

                    className="
                    bg-white rounded-[35px]

                    overflow-hidden shadow-md
                  "
                  >

                    {editingId === p._id ? (

                      <div className="p-8 space-y-5">

                        <input
                          value={editData.name}

                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              name:
                                e.target.value,
                            })
                          }

                          className="
                          w-full px-5 py-4

                          rounded-2xl border
                        "
                        />

                        <input
                          value={editData.price}

                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              price:
                                e.target.value,
                            })
                          }

                          className="
                          w-full px-5 py-4

                          rounded-2xl border
                        "
                        />

                        <textarea
                          rows={5}

                          value={
                            editData.description
                          }

                          onChange={(e) =>
                            setEditData({
                              ...editData,

                              description:
                                e.target.value,
                            })
                          }

                          className="
                          w-full px-5 py-4

                          rounded-2xl border
                        "
                        />

                        <div className="flex gap-4">

                          <button
                            onClick={() =>
                              handleUpdate(
                                p._id
                              )
                            }

                            className="
                            flex-1 py-4

                            rounded-2xl

                            bg-green-500
                            text-white

                            font-bold
                          "
                          >
                            Save Changes ✅
                          </button>

                          <button
                            onClick={() =>
                              setEditingId(null)
                            }

                            className="
                            flex-1 py-4

                            rounded-2xl

                            bg-gray-200
                          "
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                    ) : (

                      <div
                        className="
                        flex flex-col
                        md:flex-row

                        gap-6 p-7
                      "
                      >

                        <div
                          className="
                          w-full md:w-56
                          h-56

                          rounded-[30px]
                          overflow-hidden
                        "
                        >

                          {p.image && (

                            <img
                              src={p.image}

                              alt={p.name}

                              className="
                              w-full h-full
                              object-cover
                            "
                            />
                          )}
                        </div>

                        <div
                          className="
                          flex flex-col
                          flex-grow
                          justify-between
                        "
                        >

                          <div>

                            <div
                              className="
                              flex gap-2
                              mb-4 flex-wrap
                            "
                            >

                              {p.category && (

                                <span
                                  className="
                                  text-xs

                                  px-3 py-1
                                  rounded-full

                                  bg-gray-200
                                "
                                >
                                  {p.category}
                                </span>
                              )}

                              {p.brand && (

                                <span
                                  className="
                                  text-xs

                                  px-3 py-1
                                  rounded-full

                                  bg-blue-100
                                  text-blue-700
                                "
                                >
                                  {p.brand}
                                </span>
                              )}

                              <span
                                className="
                                text-xs

                                px-3 py-1
                                rounded-full

                                bg-black text-white
                              "
                              >
                                Stock: {p.stock}
                              </span>

                              {p.status ===
                              "approved" ? (

                                <span
                                  className="
                                  text-xs

                                  px-3 py-1
                                  rounded-full

                                  bg-green-100
                                  text-green-700
                                "
                                >
                                  Approved ✅
                                </span>

                              ) : (

                                <span
                                  className="
                                  text-xs

                                  px-3 py-1
                                  rounded-full

                                  bg-yellow-100
                                  text-yellow-700
                                "
                                >
                                  Pending ⏳
                                </span>
                              )}
                            </div>

                            <h3
                              className="
                              text-3xl font-black
                            "
                            >
                              {p.name}
                            </h3>

                            <p
                              className="
                              text-gray-500

                              mt-4 leading-8
                            "
                            >
                              {p.description}
                            </p>

                            <p
                              className="
                              text-4xl font-black
                              mt-6
                            "
                            >
                              ₹{p.price}
                            </p>
                          </div>

                          <div
                            className="
                            flex gap-4 mt-8
                          "
                          >

                            <button
                              onClick={() =>
                                handleEditClick(p)
                              }

                              className="
                              px-6 py-3

                              rounded-2xl

                              bg-blue-500
                              text-white
                            "
                            >
                              Edit ✏️
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  p._id
                                )
                              }

                              className="
                              px-6 py-3

                              rounded-2xl

                              bg-red-500
                              text-white
                            "
                            >
                              Delete 🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (

              <div
                className="
                bg-white rounded-[35px]

                shadow-md overflow-hidden
              "
              >

                <div
                  className="
                  p-8 border-b

                  flex items-center
                  justify-between
                "
                >

                  <div>

                    <p
                      className="
                      uppercase tracking-[4px]

                      text-xs text-gray-400

                      font-bold
                    "
                    >
                      Seller Orders
                    </p>

                    <h2
                      className="
                      text-4xl font-black
                      mt-3
                    "
                    >
                      Orders Received 🧾
                    </h2>
                  </div>

                  <div
                    className="
                    w-16 h-16 rounded-3xl

                    bg-black text-white

                    flex items-center
                    justify-center

                    text-3xl
                  "
                  >
                    📦
                  </div>
                </div>

                {ordersLoading ? (

                  <div className="p-10 text-center">
                    Loading orders...
                  </div>

                ) : sellerOrders.length === 0 ? (

                  <div className="p-10 text-center">

                    <h3
                      className="
                      text-2xl font-black
                    "
                    >
                      No Orders Yet 😭
                    </h3>

                    <p
                      className="
                      text-gray-500 mt-3
                    "
                    >
                      Once users buy your products,
                      orders will appear here.
                    </p>
                  </div>

                ) : (

                  <div className="divide-y">

                    {sellerOrders.map(
                      (order) => (

                        <div
                          key={order._id}

                          className="p-8"
                        >

                          <div
                            className="
                            flex flex-col
                            md:flex-row

                            md:items-center
                            md:justify-between

                            gap-5
                          "
                          >

                            <div>

                              <h3
                                className="
                                text-2xl font-black
                              "
                              >
                                {
                                  order.customer
                                    ?.name
                                }
                              </h3>

                              <p className="text-gray-500">
                                {
                                  order.customer
                                    ?.email
                                }
                              </p>
                            </div>

                            <div
                              className="
                              flex gap-3
                              flex-wrap
                            "
                            >

                              <span
                                className="
                                px-4 py-2
                                rounded-full

                                bg-black text-white

                                text-sm font-semibold
                              "
                              >
                                ₹{
                                  order.totalPrice
                                }
                              </span>

                              <span
                                className="
                                px-4 py-2
                                rounded-full

                                bg-green-100
                                text-green-700

                                text-sm font-semibold
                              "
                              >
                                {
                                  order.paymentStatus
                                }
                              </span>

                              <span
                                className="
                                px-4 py-2
                                rounded-full

                                bg-blue-100
                                text-blue-700

                                text-sm font-semibold
                              "
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div
                            className="
                            grid md:grid-cols-2

                            gap-5 mt-8
                          "
                          >

                            {order.products.map(
                              (
                                item,
                                i
                              ) => (

                                <div
                                  key={i}

                                  className="
                                  border rounded-[25px]

                                  p-5 flex gap-5
                                "
                                >

                                  <img
                                    src={
                                      item.image ||
                                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                                    }

                                    alt={
                                      item.name
                                    }

                                    className="
                                    w-24 h-24

                                    rounded-2xl
                                    object-cover
                                  "
                                  />

                                  <div>

                                    <h4
                                      className="
                                      font-black
                                      text-lg
                                    "
                                    >
                                      {
                                        item.name
                                      }
                                    </h4>

                                    <p
                                      className="
                                      text-gray-500
                                      text-sm mt-2
                                    "
                                    >
                                      {
                                        item.category
                                      }
                                    </p>

                                    <p
                                      className="
                                      font-bold mt-3
                                    "
                                    >
                                      ₹{
                                        item.price
                                      }
                                    </p>

                                    <p
                                      className="
                                      text-sm
                                      text-gray-500
                                      mt-1
                                    "
                                    >
                                      Qty:
                                      {" "}
                                      {
                                        item.quantity
                                      }
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;