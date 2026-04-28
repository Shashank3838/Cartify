import { useEffect, useState } from "react";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("products");
  const [error, setError] = useState(null);

  // ================= PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products/admin", {
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
    } catch (err) {
      console.error(err);
      setError("Server error");
      setProducts([]);
    }
  };

  const updateProductStatus = async (id, type) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${id}/${type}`,
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
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
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
    } catch (err) {
      console.error(err);
      setError("Server error");
      setOrders([]);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
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
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (view === "orders") {
      fetchOrders();
    }
  }, [view]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard 👑</h1>

      {/* TOGGLE */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("products")}
          className={`px-4 py-2 rounded ${
            view === "products" ? "bg-black text-white" : "bg-gray-300"
          }`}
        >
          Products
        </button>

        <button
          onClick={() => setView("orders")}
          className={`px-4 py-2 rounded ${
            view === "orders" ? "bg-black text-white" : "bg-gray-300"
          }`}
        >
          Orders
        </button>
      </div>

      {error && (
        <p className="text-red-500 font-semibold mb-4">⚠️ {error}</p>
      )}

      {/* ================= PRODUCTS ================= */}
      {view === "products" && (
        <>
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                className="bg-white p-4 mb-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold">{p.name}</h2>
                  <p>₹ {p.price}</p>
                  <p className="text-sm text-gray-500">{p.description}</p>

                  <p className="mt-1">
                    {p.status === "approved" && (
                      <span className="text-green-600 font-bold">Approved ✅</span>
                    )}
                    {p.status === "pending" && (
                      <span className="text-yellow-600 font-bold">Pending ⏳</span>
                    )}
                    {p.status === "rejected" && (
                      <span className="text-red-600 font-bold">Rejected ❌</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  {p.status !== "approved" && (
                    <button
                      onClick={() => updateProductStatus(p._id, "approve")}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                  )}

                  {p.status !== "rejected" && (
                    <button
                      onClick={() => updateProductStatus(p._id, "reject")}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* ================= ORDERS ================= */}
      {view === "orders" && (
        <>
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            orders.map((o) => (
              <div key={o._id} className="bg-white p-4 mb-4 rounded shadow">
                <p className="font-bold">Order ID: {o._id}</p>
                <p>Total: ₹ {o.totalPrice}</p>

                {/* ORDER STATUS */}
                <p className="mt-1">
                  {o.status === "pending" && (
                    <span className="text-yellow-600 font-bold">Pending ⏳</span>
                  )}
                  {o.status === "paid" && (
                    <span className="text-green-600 font-bold">Paid ✅</span>
                  )}
                  {o.status === "shipped" && (
                    <span className="text-blue-600 font-bold">Shipped 🚚</span>
                  )}
                  {o.status === "delivered" && (
                    <span className="text-green-700 font-bold">Delivered ✅</span>
                  )}
                  {o.status === "cancelled" && (
                    <span className="text-red-600 font-bold">Cancelled ❌</span>
                  )}
                </p>

                {/* PAYMENT STATUS */}
                <p className="mt-1">
                  {o.paymentStatus === "success" && (
                    <span className="text-green-600 font-bold">
                      Payment: Success 💳
                    </span>
                  )}
                  {o.paymentStatus === "pending" && (
                    <span className="text-yellow-600 font-bold">
                      Payment: Pending ⏳
                    </span>
                  )}
                  {o.paymentStatus === "failed" && (
                    <span className="text-red-600 font-bold">
                      Payment: Failed ❌
                    </span>
                  )}
                </p>

                {/* PAYMENT ID */}
                {o.paymentId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Payment ID: {o.paymentId}
                  </p>
                )}

                {/* PRODUCTS */}
                <div className="mt-3">
                  {o.products.map((item, index) => (
                    <div key={index} className="border-t pt-2 mt-2">
                      <p>{item.name}</p>
                      <p>₹ {item.price} × {item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* 🔥 FINAL FIXED BUTTON LOGIC */}
                <div className="flex gap-2 mt-3">

                  {(o.status === "paid" || o.status === "pending") &&
                    o.paymentStatus === "success" && (
                      <button
                        onClick={() => updateOrderStatus(o._id, "shipped")}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Mark Shipped 🚚
                      </button>
                    )}

                  {o.status === "shipped" && (
                    <button
                      onClick={() => updateOrderStatus(o._id, "delivered")}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Mark Delivered ✅
                    </button>
                  )}

                  {o.status === "cancelled" && (
                    <p className="text-red-600 font-bold">
                      Cancelled ❌ (No actions allowed)
                    </p>
                  )}

                  {o.paymentStatus !== "success" && o.status !== "cancelled" && (
                    <p className="text-gray-500 text-sm">
                      Waiting for payment...
                    </p>
                  )}

                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;