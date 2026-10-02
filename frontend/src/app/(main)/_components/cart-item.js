import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartItem({ item, onMinus, onPlus, onRemove }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium">{item.name}</p>
        <p className="text-sm text-slate-600">{formatPrice(item.price)}</p>
        <button onClick={onRemove} className="text-[13px] text-slate-500 underline">
          Remove
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" onClick={onMinus} disabled={item.quantity <= 1} aria-label="Less">
          −
        </Button>
        <span className="w-6 text-center font-semibold">{item.quantity}</span>
        <Button size="icon" variant="outline" onClick={onPlus} aria-label="More">
          +
        </Button>
      </div>
    </li>
  );
}
