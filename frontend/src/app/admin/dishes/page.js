"use client";
import { useState } from "react";
import { CategorySidebar } from "./_features/category-sidebar";
import { DishGrid } from "./_features/dish-grid";

// Two columns: categories, then dishes. On a phone they stack.
export default function AdminDishesPage() {
  const [selectedId, setSelectedId] = useState(null); // null = All

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <CategorySidebar selectedId={selectedId} onSelect={setSelectedId} />
      <DishGrid categoryId={selectedId} />
    </div>
  );
}
