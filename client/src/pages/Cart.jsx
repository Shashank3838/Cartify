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

  const DELIVERY = cart.length > 0 ? 40 : 0;
  const GRAND_TOTAL = total + DELIVERY;

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

      const orderRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ amount: GRAND_TOTAL }),
        }
      );

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert("Payment init failed");
        return;
      }

      const options = {
        key: "rzp_test_SfLPPwPyaJO937",
        amount: orderData.amount,
        currency: "INR",
        name: "Cartify",
        description: "Order Payment",
        order_id: orderData.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  products: cart.map((item) => ({
                    product: item.product?._id || item._id,
                    quantity: item.qty,
                  })),
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              alert("Payment verification failed ❌");
              return;
            }

            alert("Payment successful 🎉");
            setCart([]);
            navigate("/my-orders");

          } catch (err) {
            alert("Verification error");
          }
        },

        theme: { color: "#111827" },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      alert("Payment error");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 tracking-wide">
        🛒 Your Cart
      </h2>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
          <p className="text-2xl mb-3">🛍️</p>
          <p className="text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 px-6 py-2 bg-black text-white rounded-full hover:opacity-90 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="md:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row gap-5
                shadow-md hover:shadow-2xl hover:-translate-y-1
                transition-all duration-300"
              >
                <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain h-full w-full"
                  />
                </div>

                <div className="flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {item.name}
                    </h3>

                    <p className="text-black font-bold mt-2">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg"
                    >
                      −
                    </button>

                    <span className="font-medium">{item.qty}</span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start sm:items-end">
                  <p className="font-bold text-gray-900">
                    ₹{item.price * item.qty}
                  </p>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-400 hover:text-red-500 text-sm transition"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
            <h3 className="text-lg font-semibold mb-5">
              Order Summary
            </h3>

            <div className="space-y-3 text-gray-600 text-sm">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{DELIVERY}</span>
              </div>
            </div>

            <hr className="my-5" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Grand Total</span>
              <span>₹{GRAND_TOTAL}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl
              bg-black text-white font-medium tracking-wide
              hover:bg-gray-900 hover:shadow-xl hover:scale-[1.02]
              active:scale-95 transition-all duration-200"
            >
              Proceed to Pay 💳
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;