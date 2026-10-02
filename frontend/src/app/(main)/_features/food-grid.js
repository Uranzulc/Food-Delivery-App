"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useDishes } from "@/providers/dish-provider";
import { FoodCard } from "../_components/food-card";

export function FoodGrid({ categoryId }) {
  const { user } = useAuth();
  const { add } = useCart();
  const { dishes, loading, error } = useDishes();
  const [needLogin, setNeedLogin] = useState(false);

  const shown = categoryId ? dishes.filter((d) => d.category?._id === categoryId) : dishes;

  function onAdd(food) {
    if (!user) {
      setNeedLogin(true); 
      return;
    }
    add(food);
  }

  return (
    <section>
      {needLogin && !user && (
        <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Log in to order.{" "}
          <Link href="/login" className="font-medium underline">
            Log in
          </Link>
        </p>
      )}
      {error && <p className="mb-2 text-[13px] text-red-600">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {!loading && !error && shown.length === 0 && <p className="text-sm text-slate-600">No dishes here yet.</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((f) => (
          <FoodCard key={f._id} food={f} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
