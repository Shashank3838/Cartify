import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 🔥 FETCH CART FROM BACKEND
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCart([]);
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();

      if (data?.items) {
        const formatted = data.items.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          qty: item.quantity,
        }));

        setCart(formatted);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
      setCart([]);
    }
  };

  // 🔥 LOAD + AUTO SYNC CART
  useEffect(() => {
    fetchCart();

    const handleFocus = () => fetchCart();
    const handleStorage = () => fetchCart();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // 🔥 ADD TO CART
  const addToCart = async (product) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 REMOVE FROM CART
  const removeFromCart = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 INCREASE QTY
  const increaseQty = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DECREASE QTY
  const decreaseQty = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 TOTAL PRICE
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 🔥 TOTAL ITEM COUNT
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};