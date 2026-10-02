"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useOrders } from "@/providers/order-provider";
import { OrderRow } from "./_components/order-row";

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const { myOrders, loading, error, loadMyOrders } = useOrders();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else loadMyOrders();
    
  }, [ready, user]);

  if (!ready || !user) return null;

  return (
    <section>
      <h1 className="mb-3 text-lg font-semibold">My orders</h1>
      {error && <p className="mb-2 text-[13px] text-red-600">{error}</p>}
      {loading && myOrders.length === 0 && <p className="text-sm text-slate-500">Loading…</p>}
      {!loading && !error && myOrders.length === 0 && (
        <p className="text-sm text-slate-600">No orders yet. Pick something from the menu.</p>
      )}
      <ul className="space-y-3">
        {myOrders.map((o) => (
          <OrderRow key={o._id} order={o} />
        ))}
      </ul>
    </section>
  );
}
