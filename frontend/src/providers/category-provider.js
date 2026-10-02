"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api, { errorMessage } from "@/app/_api/api";

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      setError("");
      const res = await api.get("/food-category");
      setCategories(res.data);
    } catch (err) {
      setError(errorMessage(err, "Could not load categories"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  // add / rename / delete throw on failure so the form can show the server's message
  async function addCategory(name) {
    const res = await api.post("/food-category", { name });
    setCategories((prev) => [...prev, res.data]);
  }

  async function renameCategory(id, name) {
    const res = await api.put("/food-category", { id, name });
    setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
  }

  async function deleteCategory(id) {
    await api.delete("/food-category", { data: { id } });
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <CategoryContext.Provider
      value={{ categories, loading, error, refresh, addCategory, renameCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext);
