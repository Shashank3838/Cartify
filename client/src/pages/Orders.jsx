import { useEffect, useState } from "react";

/* 🔥 PREMIUM ORDER TIMELINE */
const OrderTimeline = ({ status }) => {
  const steps = ["pending", "paid", "shipped", "delivered"];
  const labels = ["Ordered", "Paid", "Shipped", "Delivered"];

  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              
              {/* LINE */}
              {index !== 0 && (
                <div
                  className={`absolute top-3 left-[-50%] w-full h-[3px] ${
                    index <= currentStepIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}

              {/* CIRCLE */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold z-10 transition ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white scale-110 shadow-lg"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>

              {/* LABEL */}
              <p className="text-xs mt-2 text-gray-600 text-center">
                {labels[index]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [returningId, setReturningId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://cartify-backend-s1hd.onrender.com/api/orders/my-orders", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    setCancellingId(id);
    await fetch(`https://cartify-backend-s1hd.onrender.com/api/orders/cancel/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    fetchOrders();
    setCancellingId(null);
  };

  const requestReturn = async (id) => {
    setReturningId(id);
    await fetch(`https://cartify-backend-s1hd.onrender.com/api/orders/return/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    fetchOrders();
    setReturningId(null);
  };

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      shipped: "bg-blue-100 text-blue-700",
      delivered: "bg-green-200 text-green-800",
      cancelled: "bg-red-100 text-red-700",
      return_requested: "bg-orange-100 text-orange-700",
      refunded: "bg-purple-100 text-purple-700",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Orders 🧾</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-6 mb-6 rounded-2xl shadow-md hover:shadow-xl transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                Order ID: {order._id.slice(-8)}
              </p>
              <p className="font-bold text-lg">
                ₹ {order.totalPrice}
              </p>
            </div>

            {/* STATUS BADGE */}
            <div className="mb-2">{statusBadge(order.status)}</div>

            {/* TIMELINE */}
            {!["cancelled", "refunded", "return_requested"].includes(order.status) && (
              <OrderTimeline status={order.status} />
            )}

            {/* PAYMENT */}
            <div className="mt-4 text-sm text-gray-600">
              Payment:{" "}
              <span className="font-medium">
                {order.paymentStatus}
              </span>
            </div>

            {/* PRODUCTS */}
            <div className="mt-5 border-t pt-4">
              {order.products?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 text-sm"
                >
                  <span>{item.name}</span>
                  <span>
                    ₹ {item.price} × {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="mt-5 flex gap-3">
              {(order.status === "pending" || order.status === "paid") && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  disabled={cancellingId === order._id}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Cancel ❌
                </button>
              )}

              {order.status === "delivered" && (
                <button
                  onClick={() => requestReturn(order._id)}
                  disabled={returningId === order._id}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                >
                  Return 🔁
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;