import { useEffect, useState } from "react";

function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("products");
  const [error, setError] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/admin`,
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setError(
          data.message ||
            "Failed to fetch products"
        );

        setProducts([]);
        return;
      }

      setProducts(Array.isArray(data) ? data : []);

    } catch {

      setError("Server error");
      setProducts([]);
    }
  };

  // APPROVE / REJECT
  const updateProductStatus = async (
    id,
    type
  ) => {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${id}/${type}`,
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

    alert(data.message);

    fetchProducts();
  };

  // FETCH ORDERS
  const fetchOrders = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setError(
          data.message ||
            "Failed to fetch orders"
        );

        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);

    } catch {

      setError("Server error");
      setOrders([]);
    }
  };

  // UPDATE ORDER STATUS
  const updateOrderStatus = async (
    id,
    status
  ) => {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders/${id}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },

        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();

    alert(data.message);

    fetchOrders();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {

    if (view === "orders") {
      fetchOrders();
    }

  }, [view]);

  // STATS
  const approvedProducts =
    products.filter(
      (p) => p.status === "approved"
    ).length;

  const pendingProducts =
    products.filter(
      (p) => p.status === "pending"
    ).length;

  const rejectedProducts =
    products.filter(
      (p) => p.status === "rejected"
    ).length;

  const totalRevenue =
    orders.reduce(
      (acc, order) =>
        acc + Number(order.totalPrice || 0),
      0
    );

  return (

    <div
      className="min-h-screen
      bg-[#f5f7fb]
      px-6 py-8"
    >

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div
          className="relative overflow-hidden
          rounded-[40px]
          bg-gradient-to-br
          from-black via-gray-900 to-purple-950
          px-10 py-16 mb-12
          shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
        >

          <div
            className="absolute
            top-0 right-0
            w-[350px] h-[350px]
            bg-purple-500/20
            blur-[120px]
            rounded-full"
          />

          <div className="relative z-10">

            <p
              className="uppercase
              tracking-[6px]
              text-sm text-gray-400
              font-semibold mb-5"
            >
              Cartify Control Center
            </p>

            <h1
              className="text-5xl md:text-7xl
              font-black text-white"
            >
              Admin Dashboard 👑
            </h1>

            <p
              className="text-gray-300
              text-lg mt-6
              max-w-2xl leading-8"
            >
              Monitor platform products,
              approvals, orders and
              ecommerce activity.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div
          className="grid grid-cols-1
          sm:grid-cols-2 lg:grid-cols-4
          gap-6 mb-10"
        >

          {[
            {
              title: "Approved",
              value: approvedProducts,
              icon: "✅",
            },

            {
              title: "Pending",
              value: pendingProducts,
              icon: "⏳",
            },

            {
              title: "Rejected",
              value: rejectedProducts,
              icon: "❌",
            },

            {
              title: "Revenue",
              value: `₹${totalRevenue}`,
              icon: "💰",
            },

          ].map((item, i) => (

            <div
              key={i}

              className="bg-white
              rounded-[30px]
              p-7 shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-500"
            >

              <div
                className="flex
                items-center
                justify-between"
              >

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2
                    className="text-4xl
                    font-black mt-3"
                  >
                    {item.value}
                  </h2>
                </div>

                <div
                  className="w-16 h-16
                  rounded-2xl
                  bg-black text-white
                  flex items-center
                  justify-center
                  text-3xl"
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TOGGLE */}
        <div
          className="flex gap-4
          mb-10"
        >

          <button
            onClick={() =>
              setView("products")
            }

            className={`px-7 py-3
            rounded-2xl
            font-bold transition-all

            ${
              view === "products"
                ? "bg-black text-white shadow-xl"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Products 📦
          </button>

          <button
            onClick={() =>
              setView("orders")
            }

            className={`px-7 py-3
            rounded-2xl
            font-bold transition-all

            ${
              view === "orders"
                ? "bg-black text-white shadow-xl"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Orders 🧾
          </button>
        </div>

        {/* ERROR */}
        {error && (

          <div
            className="bg-red-100
            text-red-700
            px-5 py-4
            rounded-2xl
            mb-8 font-semibold"
          >
            ⚠️ {error}
          </div>
        )}

        {/* PRODUCTS */}
        {view === "products" && (

          products.length === 0 ? (

            <div
              className="bg-white
              rounded-[30px]
              p-16 text-center
              shadow-lg"
            >

              <h2
                className="text-3xl
                font-black"
              >
                No Products Found 😴
              </h2>

            </div>

          ) : (

            <div className="space-y-8">

              {products.map((p) => (

                <div
                  key={p._id}

                  className="bg-white
                  rounded-[35px]
                  p-7 shadow-lg
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-500"
                >

                  <div
                    className="flex
                    flex-col lg:flex-row
                    gap-8"
                  >

                    {/* IMAGE */}
                    <div
                      className="w-full
                      lg:w-72 h-72
                      rounded-[30px]
                      overflow-hidden"
                    >

                      {p.image && (

                        <img
                          src={p.image}
                          alt={p.name}

                          className="w-full
                          h-full object-cover
                          hover:scale-110
                          transition-transform
                          duration-700"
                        />
                      )}
                    </div>

                    {/* CONTENT */}
                    <div
                      className="flex-1
                      flex flex-col
                      justify-between"
                    >

                      <div>

                        <div
                          className="flex
                          flex-wrap gap-3 mb-5"
                        >

                          {p.status ===
                            "approved" && (

                            <span
                              className="px-4
                              py-2 rounded-full
                              text-sm
                              bg-green-100
                              text-green-700"
                            >
                              Approved ✅
                            </span>
                          )}

                          {p.status ===
                            "pending" && (

                            <span
                              className="px-4
                              py-2 rounded-full
                              text-sm
                              bg-yellow-100
                              text-yellow-700"
                            >
                              Pending ⏳
                            </span>
                          )}

                          {p.status ===
                            "rejected" && (

                            <span
                              className="px-4
                              py-2 rounded-full
                              text-sm
                              bg-red-100
                              text-red-700"
                            >
                              Rejected ❌
                            </span>
                          )}
                        </div>

                        <h2
                          className="text-4xl
                          font-black"
                        >
                          {p.name}
                        </h2>

                        <p
                          className="text-5xl
                          font-black mt-5"
                        >
                          ₹{p.price}
                        </p>

                        <p
                          className="text-gray-500
                          leading-8 mt-6"
                        >
                          {p.description}
                        </p>
                      </div>

                      {/* BUTTONS */}
                      <div
                        className="flex
                        flex-wrap gap-4 mt-8"
                      >

                        {p.status !==
                          "approved" && (

                          <button
                            onClick={() =>
                              updateProductStatus(
                                p._id,
                                "approve"
                              )
                            }

                            className="px-7
                            py-4 rounded-2xl
                            bg-green-500
                            text-white
                            font-bold
                            hover:scale-105
                            hover:bg-green-600
                            transition-all
                            duration-300"
                          >
                            Approve ✅
                          </button>
                        )}

                        {p.status !==
                          "rejected" && (

                          <button
                            onClick={() =>
                              updateProductStatus(
                                p._id,
                                "reject"
                              )
                            }

                            className="px-7
                            py-4 rounded-2xl
                            bg-red-500
                            text-white
                            font-bold
                            hover:scale-105
                            hover:bg-red-600
                            transition-all
                            duration-300"
                          >
                            Reject ❌
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ORDERS */}
        {view === "orders" && (

          orders.length === 0 ? (

            <div
              className="bg-white
              rounded-[30px]
              p-16 text-center
              shadow-lg"
            >

              <h2
                className="text-3xl
                font-black"
              >
                No Orders Yet 😴
              </h2>

            </div>

          ) : (

            <div className="space-y-8">

              {orders.map((o) => (

                <div
                  key={o._id}

                  className="bg-white
                  rounded-[35px]
                  p-8 shadow-lg
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-500"
                >

                  <div
                    className="flex
                    flex-col lg:flex-row
                    justify-between
                    gap-8"
                  >

                    <div>

                      <h2
                        className="text-2xl
                        font-black"
                      >
                        Order #{o._id.slice(-6)}
                      </h2>

                      <p
                        className="text-5xl
                        font-black mt-4"
                      >
                        ₹{o.totalPrice}
                      </p>

                      <div
                        className="flex
                        flex-wrap gap-3 mt-5"
                      >

                        <span
                          className="px-4 py-2
                          rounded-full
                          bg-gray-200
                          text-sm"
                        >
                          {o.status}
                        </span>

                        <span
                          className="px-4 py-2
                          rounded-full
                          bg-black
                          text-white
                          text-sm"
                        >
                          Payment:
                          {o.paymentStatus}
                        </span>
                      </div>

                      {/* PRODUCTS */}
                      <div className="mt-7 space-y-3">

                        {o.products.map(
                          (item, i) => (

                            <div
                              key={i}

                              className="bg-gray-100
                              rounded-2xl
                              px-5 py-4
                              hover:bg-gray-200
                              transition-all"
                            >

                              <div
                                className="flex
                                justify-between"
                              >

                                <span
                                  className="font-semibold"
                                >
                                  {item.name}
                                </span>

                                <span>
                                  ₹{item.price}
                                  ×
                                  {item.quantity}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div
                      className="flex
                      flex-col gap-4
                      lg:w-64"
                    >

                      {(o.status ===
                        "paid" ||

                        o.status ===
                          "pending") &&

                        o.paymentStatus ===
                          "success" && (

                          <button
                            onClick={() =>
                              updateOrderStatus(
                                o._id,
                                "shipped"
                              )
                            }

                            className="w-full
                            py-4 rounded-2xl
                            bg-blue-500
                            text-white
                            font-bold
                            hover:scale-105
                            hover:bg-blue-600
                            transition-all
                            duration-300"
                          >
                            Mark Shipped 🚚
                          </button>
                        )}

                      {o.status ===
                        "shipped" && (

                        <button
                          onClick={() =>
                            updateOrderStatus(
                              o._id,
                              "delivered"
                            )
                          }

                          className="w-full
                          py-4 rounded-2xl
                          bg-green-600
                          text-white
                          font-bold
                          hover:scale-105
                          hover:bg-green-700
                          transition-all
                          duration-300"
                        >
                          Mark Delivered ✅
                        </button>
                      )}

                      {o.status ===
                        "cancelled" && (

                        <div
                          className="bg-red-100
                          text-red-700
                          rounded-2xl
                          py-4 text-center
                          font-bold"
                        >
                          Cancelled ❌
                        </div>
                      )}

                      {o.paymentStatus !==
                        "success" &&

                        o.status !==
                          "cancelled" && (

                          <div
                            className="bg-gray-100
                            rounded-2xl
                            py-4 text-center"
                          >
                            Waiting For Payment...
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;