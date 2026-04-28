import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    total,
    setCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  // 🔥 FINAL RAZORPAY CHECKOUT
  const handleCheckout = async () => {
    try {
      if (!cart || cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      // ===============================
      // 1️⃣ CREATE RAZORPAY ORDER
      // ===============================
      const orderRes = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ amount: total }),
        }
      );

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert("Payment init failed");
        return;
      }

      // ===============================
      // 2️⃣ OPEN RAZORPAY POPUP
      // ===============================
      const options = {
        key: "rzp_test_SfLPPwPyaJO937", // ✅ your key
        amount: orderData.amount,
        currency: "INR",
        name: "MyStore",
        description: "Order Payment",
        order_id: orderData.id,

        handler: async function (response) {
          try {
            console.log("💰 Payment success:", response);

            // ===============================
            // 3️⃣ CREATE ORDER WITH PAYMENT ID
            // ===============================
            const res = await fetch(
              "http://localhost:5000/api/orders",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                  products: cart.map((item) => ({
                    product: item.product?._id || item._id,
                    quantity: item.qty,
                  })),
                  paymentId: response.razorpay_payment_id, // 🔥 IMPORTANT
                }),
              }
            );

            const data = await res.json();

            if (!res.ok) {
              console.error("❌ Order failed:", data);
              alert("Order creation failed ❌");
              return;
            }

            // ===============================
            // 4️⃣ CLEAR CART (BACKEND)
            // ===============================
            await fetch("http://localhost:5000/api/cart/clear", {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            });

            // ===============================
            // 5️⃣ CLEAR UI CART
            // ===============================
            setCart([]);

            alert("Payment successful 🎉 Order placed!");

            navigate("/my-orders");

          } catch (err) {
            console.error("🔥 POST PAYMENT ERROR:", err);
            alert("Payment success but something failed");
          }
        },

        prefill: {
          name: "User",
          email: "test@example.com",
        },

        theme: {
          color: "#16a34a",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      alert("Something went wrong during payment");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>₹{item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-2 bg-gray-300 rounded"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-2 bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          {/* TOTAL + PAYMENT */}
          <div className="text-right mt-6">
            <h3 className="text-xl font-bold mb-3">
              Total: ₹{total}
            </h3>

            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Pay Now 💳
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;