"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); 
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, hydrated]);

  function add(food) {
    setItems((prev) => {
      const found = prev.find((i) => i.foodId === food._id);
      if (found) return prev.map((i) => (i.foodId === food._id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { foodId: food._id, name: food.name, price: food.price, image: food.image, quantity: 1 }];
    });
  }

  function remove(foodId) {
    setItems((prev) => prev.filter((i) => i.foodId !== foodId));
  }

  // never below 1
  function setQuantity(foodId, quantity) {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.foodId === foodId ? { ...i, quantity } : i)));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, open, setOpen, add, remove, setQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
