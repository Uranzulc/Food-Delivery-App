import { formatDate, formatPrice, cn } from "@/lib/utils";

const statusStyle = {
  PENDING: "bg-amber-100 text-amber-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

export function OrderRow({ order }) {
  const count = order.items.reduce((n, i) => n + i.quantity, 0);
  return (
    <li className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">
          {formatDate(order.createdAt)} · {count} {count === 1 ? "item" : "items"} ·{" "}
          <span className="font-semibold">{formatPrice(order.total)}</span>
        </p>
        <span className={cn("rounded-full px-3 py-0.5 text-[13px] font-medium", statusStyle[order.status])}>
          {order.status.toLowerCase()}
        </span>
      </div>
      <ul className="mt-2 text-sm text-slate-600">
        {order.items.map((it, i) => (
          <li key={i}>
            {it.quantity} × {it.food?.name || it.name}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[13px] text-slate-500">Deliver to: {order.address}</p>
    </li>
  );
}
