"use client";
import { useState } from "react";
import { CategoryChips } from "./_features/category-chips";
import { FoodGrid } from "./_features/food-grid";

export default function HomePage() {
  const [selectedId, setSelectedId] = useState(null); // null = All

  return (
    <div className="space-y-4">
      <CategoryChips selectedId={selectedId} onSelect={setSelectedId} />
      <FoodGrid categoryId={selectedId} />
    </div>
  );
}
