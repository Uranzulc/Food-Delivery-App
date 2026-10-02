"use client";
import { useEffect } from "react";
import { useOrders } from "@/providers/order-provider";
import { formatDate, formatPrice } from "@/lib/utils";
import { StatusSelect } from "../_components/status-select";

export function OrdersTable() {
  const { allOrders, loading, error, loadAllOrders, updateStatus } = useOrders();

  useEffect(() => {
    loadAllOrders();
  }, []);

  return (
    <section>
      <h1 className="mb-3 text-lg font-semibold">Orders</h1>
      {error && <p className="mb-2 text-[13px] text-red-600">{error}</p>}
      {loading && allOrders.length === 0 && <p className="text-sm text-slate-500">Loading…</p>}
      {!loading && !error && allOrders.length === 0 && <p className="text-sm text-slate-600">No orders yet.</p>}

      {allOrders.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Address</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((o, i) => (
                <tr key={o._id} className="border-t border-slate-200 align-top">
                  <td className="px-3 py-2">{allOrders.length - i}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  <td className="px-3 py-2">{o.user?.email || "Deleted user"}</td>
                  <td className="px-3 py-2">
                    {o.items.map((it, idx) => (
                      <div key={idx}>
                        {it.quantity} × {it.food?.name || it.name}
                      </div>
                    ))}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatPrice(o.total)}</td>
                  <td className="px-3 py-2">{o.address}</td>
                  <td className="px-3 py-2">
                    <StatusSelect value={o.status} onChange={(status) => updateStatus(o._id, status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
