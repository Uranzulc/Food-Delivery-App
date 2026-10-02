import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function FoodCard({ food, onAdd }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200">
      {food.image ? (

        <img src={food.image} alt={food.name} className="h-36 w-full object-cover" />
      ) : (
        <div className="flex h-36 items-center justify-center bg-slate-100 text-sm text-slate-400">No image</div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex-1">
          <p className="font-semibold">{food.name}</p>
          {food.ingredients?.length > 0 && (
            <p className="text-[13px] text-slate-500">{food.ingredients.join(", ")}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{formatPrice(food.price)}</span>
          <Button size="sm" onClick={() => onAdd(food)}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
