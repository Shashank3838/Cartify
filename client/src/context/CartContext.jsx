import {
  createContext,
  useState,
  useEffect,
} from "react";

export const CartContext =
  createContext();

export const CartProvider = ({
  children,
}) => {

  const [cart, setCart] =
    useState([]);

  // 🔥 PREMIUM TOAST
  const [toast, setToast] =
    useState({
      show: false,
      message: "",
      type: "success",
    });

  // 🔥 SHOW TOAST
  const showToast = (
    message,
    type = "success"
  ) => {

    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {

      setToast({
        show: false,
        message: "",
        type: "success",
      });

    }, 2500);
  };

  // 🔥 FETCH CART
  const fetchCart = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        setCart([]);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      );

      const data = await res.json();

      if (data?.items) {

        const formatted =
          data.items.map((item) => ({
            _id:
              item.product._id,

            name:
              item.product.name,

            price:
              item.product.price,

            image:
              item.product.image,

            qty:
              item.quantity,
          }));

        setCart(formatted);

      } else {

        setCart([]);
      }

    } catch (err) {

      console.error(
        "Fetch cart error:",
        err
      );

      setCart([]);
    }
  };

  // 🔥 LOAD + AUTO SYNC
  useEffect(() => {

    fetchCart();

    const handleFocus = () =>
      fetchCart();

    const handleStorage = () =>
      fetchCart();

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };

  }, []);

  // 🔥 ADD TO CART
  const addToCart = async (
    product,
    quantity = 1
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        showToast(
          "Please login first 🔒",
          "error"
        );

        return;
      }

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              "Bearer " + token,
          },

          body: JSON.stringify({
            productId:
              product._id,

            quantity,
          }),
        }
      );

      await fetchCart();

      showToast(
        `${product.name} added to cart 🛒`,
        "success"
      );

    } catch (err) {

      console.error(
        "Add to cart error:",
        err
      );

      showToast(
        "Failed to add product ❌",
        "error"
      );
    }
  };

  // 🔥 REMOVE FROM CART
  const removeFromCart = async (
    id
  ) => {

    try {

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem(
                "token"
              ),
          },
        }
      );

      fetchCart();

      showToast(
        "Removed from cart ❌",
        "error"
      );

    } catch (err) {

      console.error(err);

      showToast(
        "Something went wrong ❌",
        "error"
      );
    }
  };

  // 🔥 INCREASE QTY
  const increaseQty = async (
    id
  ) => {

    try {

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              "Bearer " +
              localStorage.getItem(
                "token"
              ),
          },

          body: JSON.stringify({
            productId: id,
            quantity: 1,
          }),
        }
      );

      fetchCart();

    } catch (err) {

      console.error(err);
    }
  };

  // 🔥 DECREASE QTY
  const decreaseQty = async (
    id
  ) => {

    try {

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem(
                "token"
              ),
          },
        }
      );

      fetchCart();

    } catch (err) {

      console.error(err);
    }
  };

  // 🔥 TOTAL PRICE
  const total = cart.reduce(
    (acc, item) =>
      acc +
      item.price * item.qty,
    0
  );

  // 🔥 TOTAL ITEMS
  const cartCount = cart.reduce(
    (acc, item) =>
      acc + item.qty,
    0
  );

  return (

    <>
      {/* 🔥 TOAST UI */}

      {toast.show && (

        <div
          className={`
          fixed top-6 right-6 z-[9999]
          px-6 py-4 rounded-2xl
          backdrop-blur-2xl
          border border-white/30
          shadow-[0_15px_45px_rgba(0,0,0,0.18)]
          text-white font-semibold
          animate-bounce

          ${
            toast.type === "success"
              ? "bg-black/85"
              : "bg-red-500/90"
          }
        `}
        >
          {toast.message}
        </div>
      )}

      <CartContext.Provider
        value={{
          cart,
          setCart,
          fetchCart,
          addToCart,
          removeFromCart,
          increaseQty,
          decreaseQty,
          total,
          cartCount,
          showToast,
        }}
      >
        {children}
      </CartContext.Provider>
    </>
  );
};