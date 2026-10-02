"use client";
import { createContext, useContext, useState } from "react";
import api, { errorMessage } from "@/app/_api/api";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [myOrders, setMyOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(path, setter) {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(path);
      setter(res.data);
    } catch (err) {
      setError(errorMessage(err, "Could not load orders"));
    } finally {
      setLoading(false);
    }
  }

  const loadMyOrders = () => load("/order/me", setMyOrders);
  const loadAllOrders = () => load("/order", setAllOrders);

  // Only ids and quantities go to the server. It looks up the real prices.
  async function placeOrder(items, address) {
    const res = await api.post("/order", {
      items: items.map((i) => ({ foodId: i.foodId, quantity: i.quantity })),
      address,
    });
    return res.data;
  }

  async function updateStatus(id, status) {
    const res = await api.patch(`/order/${id}`, { status });
    setAllOrders((prev) => prev.map((o) => (o._id === id ? res.data : o)));
  }

  return (
    <OrderContext.Provider
      value={{ myOrders, allOrders, loading, error, loadMyOrders, loadAllOrders, placeOrder, updateStatus }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
