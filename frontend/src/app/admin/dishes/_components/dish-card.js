import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";


export function DishCard({ dish, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      {dish.image ? (

        <img src={dish.image} alt={dish.name} className="h-32 w-full object-cover" />
      ) : (
        <div className="flex h-32 items-center justify-center bg-slate-100 text-sm text-slate-400">No image</div>
      )}
      <div className="space-y-2 p-3">
        <div>
          <p className="font-semibold">{dish.name}</p>
          <p className="text-sm text-slate-600">{formatPrice(dish.price)}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(dish)}>
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(dish)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
