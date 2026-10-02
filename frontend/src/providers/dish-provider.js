"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api, { errorMessage } from "@/app/_api/api";

const DishContext = createContext(null);

export function DishProvider({ children }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      setError("");
      const res = await api.get("/food");
      setDishes(res.data);
    } catch (err) {
      setError(errorMessage(err, "Could not load dishes"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  // Dishes come back with the category populated, so category counts are
  // always computed from this one list.
  async function addDish(values) {
    const res = await api.post("/food", values);
    setDishes((prev) => [res.data, ...prev]);
  }

  async function updateDish(id, values) {
    const res = await api.put(`/food/${id}`, values);
    setDishes((prev) => prev.map((d) => (d._id === id ? res.data : d)));
  }

  async function deleteDish(id) {
    await api.delete(`/food/${id}`);
    setDishes((prev) => prev.filter((d) => d._id !== id));
  }

  return (
    <DishContext.Provider value={{ dishes, loading, error, refresh, addDish, updateDish, deleteDish }}>
      {children}
    </DishContext.Provider>
  );
}

export const useDishes = () => useContext(DishContext);
