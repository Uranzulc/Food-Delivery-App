"use client";
import { useCategories } from "@/providers/category-provider";
import { cn } from "@/lib/utils";

export function CategoryChips({ selectedId, onSelect }) {
  const { categories } = useCategories();
  const chip = (active) =>
    cn(
      "shrink-0 rounded-full border px-4 py-1.5 text-sm",
      active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:bg-slate-100"
    );

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button className={chip(selectedId === null)} onClick={() => onSelect(null)}>
        All
      </button>
      {categories.map((c) => (
        <button key={c._id} className={chip(selectedId === c._id)} onClick={() => onSelect(c._id)}>
          {c.categoryName}
        </button>
      ))}
    </div>
  );
}
