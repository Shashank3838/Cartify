import { useContext, useEffect, useState } from "react";
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
    showToast,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] =
    useState("💳 Card");

  // 🔥 AUTO SCROLL TOP
  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, []);

  const DELIVERY =
    cart.length > 0 ? 40 : 0;

  const GRAND_TOTAL =
    total + DELIVERY;

  // 🔥 CHECKOUT
  const handleCheckout = async () => {

    try {

      if (!cart || cart.length === 0) {

        showToast(
          "Cart is empty 🛒",
          "error"
        );

        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {

        showToast(
          "Please login again 🔒",
          "error"
        );

        return;
      }

      const orderRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              "Bearer " + token,
          },

          body: JSON.stringify({
            amount: GRAND_TOTAL,
          }),
        }
      );

      const orderData =
        await orderRes.json();

      if (!orderRes.ok) {

        showToast(
          "Payment init failed ❌",
          "error"
        );

        return;
      }

      const options = {

        key:
          "rzp_test_SfLPPwPyaJO937",

        amount:
          orderData.amount,

        currency: "INR",

        name: "Cartify",

        description:
          "Premium Checkout",

        order_id:
          orderData.id,

        handler:
          async function (
            response
          ) {

            try {

              const verifyRes =
                await fetch(
                  `${import.meta.env.VITE_API_URL}/api/payment/verify`,
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      Authorization:
                        "Bearer " +
                        token,
                    },

                    body: JSON.stringify({
                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature,

                      products:
                        cart.map(
                          (
                            item
                          ) => ({
                            product:
                              item.product
                                ?._id ||
                              item._id,

                            quantity:
                              item.qty,
                          })
                        ),
                    }),
                  }
                );

              if (
                !verifyRes.ok
              ) {

                showToast(
                  "Payment verification failed ❌",
                  "error"
                );

                return;
              }

              showToast(
                "Payment successful 🎉",
                "success"
              );

              setCart([]);

              setTimeout(() => {

                navigate(
                  "/my-orders"
                );

              }, 1200);

            } catch (err) {

              showToast(
                "Verification error ❌",
                "error"
              );
            }
          },

        theme: {
          color: "#000000",
        },
      };

      const razor =
        new window.Razorpay(
          options
        );

      razor.open();

    } catch (err) {

      showToast(
        "Payment error ❌",
        "error"
      );
    }
  };

  return (

    <div
      className="
      min-h-screen
      bg-[#f5f5f7]
      px-4 sm:px-6 py-10
    "
    >

      {/* TITLE */}

      <div className="max-w-7xl mx-auto mb-12">

        <p
          className="
          uppercase tracking-[6px]
          text-sm text-gray-500
          font-semibold mb-4
        "
        >
          Premium Checkout Experience
        </p>

        <h1
          className="
          text-5xl md:text-6xl
          font-black text-gray-900
        "
        >
          Your Cart 🛒
        </h1>

        <p
          className="
          text-gray-500 mt-4
          text-lg
        "
        >
          Review your products and complete purchase
        </p>
      </div>

      {/* EMPTY */}

      {cart.length === 0 ? (

        <div
          className="
          flex flex-col items-center
          justify-center mt-24 text-gray-500
        "
        >

          <div
            className="
            w-40 h-40 rounded-full
            bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]
            flex items-center justify-center
            text-7xl
            hover:scale-105
            transition-all duration-500
          "
          >
            🛍️
          </div>

          <p className="text-4xl font-black mt-8 text-black">
            Your cart is empty
          </p>

          <p className="mt-4 text-lg">
            Add premium products to continue shopping
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
            className="
            mt-8 px-8 py-4
            rounded-2xl bg-black text-white
            font-semibold hover:scale-105
            hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)]
            transition-all duration-300
          "
          >
            Browse Products 🚀
          </button>
        </div>

      ) : (

        <div
          className="
          max-w-7xl mx-auto
          grid grid-cols-1 lg:grid-cols-3
          gap-10
        "
        >

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-8">

            {/* ITEMS */}

            <div className="space-y-6">

              {cart.map((item) => (

                <div
                  key={item._id}

                  className="
                  group bg-white/80
                  backdrop-blur-xl rounded-[35px]
                  p-6 flex flex-col sm:flex-row gap-6
                  shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                  border border-white/60
                  hover:-translate-y-2
                  hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]
                  transition-all duration-500
                "
                >

                  {/* IMAGE */}

                  <div
                    className="
                    w-full sm:w-36 h-36
                    rounded-3xl overflow-hidden
                    bg-gradient-to-br
                    from-gray-100 to-gray-200
                  "
                  >

                    <img
                      src={item.image}
                      alt={item.name}

                      className="
                      w-full h-full object-cover
                      group-hover:scale-110
                      transition duration-700
                    "
                    />
                  </div>

                  {/* CONTENT */}

                  <div
                    className="
                    flex flex-col flex-grow justify-between
                  "
                  >

                    <div>

                      <h3
                        className="
                        font-black text-2xl
                        text-gray-900
                      "
                      >
                        {item.name}
                      </h3>

                      <p
                        className="
                        text-gray-500
                        mt-3 leading-7
                      "
                      >
                        Premium selected product with
                        fast delivery and secure payment.
                      </p>

                      <p
                        className="
                        text-3xl font-black
                        mt-5
                      "
                      >
                        ₹{item.price}
                      </p>
                    </div>

                    {/* QTY */}

                    <div className="flex items-center gap-4 mt-6">

                      <button
                        onClick={() =>
                          decreaseQty(
                            item._id
                          )
                        }

                        className="
                        w-12 h-12 rounded-2xl
                        bg-gray-100 hover:bg-black
                        hover:text-white
                        text-xl transition-all duration-300
                      "
                      >
                        −
                      </button>

                      <span
                        className="
                        text-xl font-black
                      "
                      >
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(
                            item._id
                          )
                        }

                        className="
                        w-12 h-12 rounded-2xl
                        bg-gray-100 hover:bg-black
                        hover:text-white
                        text-xl transition-all duration-300
                      "
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                    flex flex-col
                    justify-between items-start sm:items-end
                  "
                  >

                    <p
                      className="
                      text-3xl
                      font-black text-black
                    "
                    >
                      ₹
                      {item.price *
                        item.qty}
                    </p>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item._id
                        )
                      }

                      className="
                      text-red-500
                      hover:scale-105
                      hover:text-red-600
                      transition-all
                    "
                    >
                      Remove ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAYMENT */}

            <div
              className="
              bg-white/80 backdrop-blur-xl
              rounded-[35px] p-8
              shadow-[0_20px_60px_rgba(0,0,0,0.08)]
              border border-white/60
            "
            >

              <h2
                className="
                text-3xl font-black mb-6
              "
              >
                Payment Method 💳
              </h2>

              <div className="grid sm:grid-cols-3 gap-5">

                {[
                  "💳 Card",
                  "🏦 UPI",
                  "💵 Cash",
                ].map(
                  (
                    method,
                    i
                  ) => (

                    <div
                      key={i}

                      onClick={() =>
                        setSelectedPayment(
                          method
                        )
                      }

                      className={`
                      group cursor-pointer
                      rounded-3xl border
                      p-6 bg-white
                      hover:-translate-y-2
                      transition-all duration-500

                      ${
                        selectedPayment ===
                        method

                          ? `
                          border-black
                          bg-black text-white
                          shadow-[0_20px_50px_rgba(0,0,0,0.18)]
                          scale-[1.02]
                        `

                          : `
                          border-gray-200
                          hover:bg-black
                          hover:text-white
                        `
                      }
                    `}
                    >

                      <div className="text-3xl mb-4">
                        {
                          method.split(
                            " "
                          )[0]
                        }
                      </div>

                      <h3 className="font-bold text-lg">
                        {
                          method.split(
                            " "
                          )[1]
                        }
                      </h3>

                      {selectedPayment ===
                        method && (

                        <div
                          className="
                          mt-4 text-sm
                          font-semibold
                          text-green-400
                        "
                        >
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* SHIPPING */}

            <div
              className="
              bg-white/80 backdrop-blur-xl
              rounded-[35px] p-8
              shadow-[0_20px_60px_rgba(0,0,0,0.08)]
              border border-white/60
            "
            >

              <h2
                className="
                text-3xl font-black mb-6
              "
              >
                Shipping Address 📦
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">

                {[
                  "Full Name",
                  "Phone Number",
                  "City",
                  "Pincode",
                ].map(
                  (
                    placeholder,
                    i
                  ) => (

                    <input
                      key={i}

                      type="text"

                      placeholder={
                        placeholder
                      }

                      className="
                      border border-gray-200
                      px-5 py-4 rounded-2xl
                      outline-none
                      focus:ring-2 focus:ring-black/80
                      hover:border-black
                      transition-all duration-300
                    "
                    />
                  )
                )}

                <textarea
                  placeholder="Full Address"

                  rows={4}

                  className="
                  sm:col-span-2
                  border border-gray-200
                  px-5 py-4 rounded-2xl
                  outline-none
                  focus:ring-2 focus:ring-black/80
                  hover:border-black
                  transition-all duration-300
                  resize-none
                "
                />
              </div>
            </div>
          </div>

          {/* SUMMARY */}

          <div
            className="
            bg-white/80 backdrop-blur-xl
            rounded-[35px] p-8 h-fit sticky top-28
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            border border-white/60

            hover:-translate-y-1
            hover:shadow-[0_25px_80px_rgba(0,0,0,0.14)]

            transition-all duration-500
          "
          >

            <h2
              className="
              text-3xl font-black mb-8
            "
            >
              Order Summary ✨
            </h2>

            <div className="space-y-5 text-gray-600">

              <div className="flex justify-between">
                <span>Items</span>
                <span>
                  {cart.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₹{total}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  ₹{DELIVERY}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>

                <span className="text-green-600">
                  − ₹120
                </span>
              </div>
            </div>

            <hr className="my-8" />

            <div
              className="
              flex justify-between
              items-center
            "
            >

              <div>

                <p className="text-gray-500">
                  Grand Total
                </p>

                <h3
                  className="
                  text-4xl font-black
                  text-black
                "
                >
                  ₹
                  {GRAND_TOTAL -
                    120}
                </h3>
              </div>

              <div
                className="
                bg-green-100 text-green-700
                px-4 py-2 rounded-full
                text-sm font-bold
              "
              >
                SAVED ₹120
              </div>
            </div>

            {/* PAY BUTTON */}

            <button
              onClick={
                handleCheckout
              }

              className="
              group relative overflow-hidden
              mt-10 w-full py-5 rounded-3xl
              bg-black text-white
              font-black text-lg

              hover:scale-[1.02]
              active:scale-95

              hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)]

              transition-all duration-300

              shadow-[0_20px_50px_rgba(0,0,0,0.3)]
            "
            >

              <div
                className="
                absolute inset-0
                bg-gradient-to-r
                from-gray-800 to-black
                opacity-0 group-hover:opacity-100
                transition duration-500
              "
              />

              <span className="relative z-10">
                Complete Secure Payment 💳
              </span>
            </button>

            {/* SECURITY */}

            <div className="mt-8 space-y-4">

              {[
                "🔒 100% Secure Payment",
                "🚚 Fast Delivery",
                "↩️ Easy Returns",
              ].map(
                (
                  item,
                  i
                ) => (

                  <div
                    key={i}

                    className="
                    flex items-center gap-3
                    text-gray-600
                  "
                  >

                    <span>
                      {
                        item.split(
                          " "
                        )[0]
                      }
                    </span>

                    <span>
                      {item.replace(
                        item.split(
                          " "
                        )[0],
                        ""
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;