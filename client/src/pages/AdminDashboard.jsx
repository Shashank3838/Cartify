import { useEffect, useState } from "react";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("products");
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://https://cartify-backend.onrender.com/api/products/admin", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch products");
        setProducts([]);
        return;
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Server error");
      setProducts([]);
    }
  };

  const updateProductStatus = async (id, type) => {
    const res = await fetch(
      `http://https://cartify-backend.onrender.com/api/products/${id}/${type}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await res.json();
    alert(data.message);
    fetchProducts();
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://https://cartify-backend.onrender.com/api/orders", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch orders");
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("Server error");
      setOrders([]);
    }
  };

  const updateOrderStatus = async (id, status) => {
    const res = await fetch(
      `http://https://cartify-backend.onrender.com/api/orders/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
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
    if (view === "orders") fetchOrders();
  }, [view]);

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-semibold mb-6">
          Admin Dashboard 👑
        </h1>

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setView("products")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                view === "products"
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Products
          </button>

          <button
            onClick={() => setView("orders")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                view === "orders"
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Orders
          </button>
        </div>

        {error && (
          <p className="text-red-500 mb-4 font-medium">⚠️ {error}</p>
        )}

        {/* ================= PRODUCTS ================= */}
        {view === "products" &&
          (products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-md p-5 
                  flex justify-between items-start 
                  hover:shadow-xl transition-all duration-300"
                >
                  {/* LEFT */}
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {p.name}
                    </h2>

                    <p className="font-bold mt-1">₹ {p.price}</p>

                    <p className="text-sm text-gray-500 mt-1">
                      {p.description}
                    </p>

                    <div className="mt-2">
                      {p.status === "approved" && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Approved
                        </span>
                      )}
                      {p.status === "pending" && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                          Pending
                        </span>
                      )}
                      {p.status === "rejected" && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex gap-2">
                    {p.status !== "approved" && (
                      <button
                        onClick={() =>
                          updateProductStatus(p._id, "approve")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm"
                      >
                        Approve
                      </button>
                    )}

                    {p.status !== "rejected" && (
                      <button
                        onClick={() =>
                          updateProductStatus(p._id, "reject")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* ================= ORDERS ================= */}
        {view === "orders" &&
          (orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o._id}
                  className="bg-white rounded-2xl shadow-md p-5 
                  hover:shadow-xl transition-all duration-300"
                >
                  <p className="font-semibold">
                    Order ID: {o._id}
                  </p>

                  <p className="mt-1">Total: ₹ {o.totalPrice}</p>

                  {/* STATUS */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {o.status}
                    </span>

                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                      Payment: {o.paymentStatus}
                    </span>
                  </div>

                  {/* PRODUCTS */}
                  <div className="mt-3 space-y-1">
                    {o.products.map((item, i) => (
                      <div key={i} className="text-sm text-gray-700">
                        {item.name} — ₹ {item.price} × {item.quantity}
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-4">

                    {(o.status === "paid" || o.status === "pending") &&
                      o.paymentStatus === "success" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(o._id, "shipped")
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Mark Shipped 🚚
                        </button>
                      )}

                    {o.status === "shipped" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(o._id, "delivered")
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {o.status === "cancelled" && (
                      <p className="text-red-600 font-medium text-sm">
                        Cancelled ❌
                      </p>
                    )}

                    {o.paymentStatus !== "success" &&
                      o.status !== "cancelled" && (
                        <p className="text-gray-500 text-sm">
                          Waiting for payment...
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default AdminDashboard;