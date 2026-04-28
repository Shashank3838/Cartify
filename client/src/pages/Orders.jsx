import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 CANCEL ORDER
  const cancelOrder = async (id) => {
    try {
      setCancellingId(id);

      const res = await fetch(
        `http://localhost:5000/api/orders/cancel/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();
      alert(data.message);

      fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Orders 🧾</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 mb-6 rounded shadow"
          >
            <p className="font-bold">Order ID: {order._id}</p>
            <p>Total: ₹ {order.totalPrice}</p>

            {/* 🔥 ORDER STATUS */}
            <p className="mt-1">
              {order.status === "pending" && (
                <span className="text-yellow-600 font-bold">Pending ⏳</span>
              )}
              {order.status === "paid" && (
                <span className="text-green-600 font-bold">Paid ✅</span>
              )}
              {order.status === "shipped" && (
                <span className="text-blue-600 font-bold">Shipped 🚚</span>
              )}
              {order.status === "delivered" && (
                <span className="text-green-700 font-bold">Delivered ✅</span>
              )}
              {order.status === "cancelled" && (
                <span className="text-red-700 font-bold">Cancelled ❌</span>
              )}
            </p>

            {/* 💳 PAYMENT STATUS */}
            <p className="mt-1">
              {order.paymentStatus === "success" && (
                <span className="text-green-600 font-bold">
                  Payment: Success 💳
                </span>
              )}

              {order.paymentStatus === "pending" && (
                <span className="text-yellow-600 font-bold">
                  Payment: Pending ⏳
                </span>
              )}

              {order.paymentStatus === "failed" && (
                <span className="text-red-600 font-bold">
                  Payment: Failed ❌
                </span>
              )}

              {/* 🔥 NEW: REFUND STATUS */}
              {order.paymentStatus === "refunded" && (
                <span className="text-purple-600 font-bold">
                  Payment: Refunded 💸
                </span>
              )}
            </p>

            {/* 💳 PAYMENT ID */}
            {order.paymentId && (
              <p className="text-xs text-gray-500 mt-1">
                Payment ID: {order.paymentId}
              </p>
            )}

            {/* PRODUCTS */}
            <div className="mt-3">
              {order.products?.map((item, index) => (
                <div key={index} className="border-t pt-2 mt-2">
                  <p>{item.name || "Product"}</p>
                  <p>
                    ₹ {item.price || "?"} × {item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* 🔥 CANCEL BUTTON (PENDING + PAID ONLY) */}
            {(order.status === "pending" || order.status === "paid") && (
              <button
                onClick={() => cancelOrder(order._id)}
                disabled={cancellingId === order._id}
                className={`mt-3 px-4 py-2 rounded text-white ${
                  cancellingId === order._id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {cancellingId === order._id
                  ? "Cancelling..."
                  : "Cancel Order ❌"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;