"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useOrders } from "@/providers/order-provider";
import { errorMessage } from "@/app/_api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/app/(auth)/_components/field-error";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "../_components/cart-item";

export function CartSheet() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, open, setOpen, setQuantity, remove, clear } = useCart();
  const { placeOrder } = useOrders();

  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.address && !address) setAddress(user.address);

  }, [user]);

  const addressError = submitted && address.trim().length < 5 ? "Enter a delivery address" : "";

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    if (items.length === 0 || address.trim().length < 5) return;

    setSaving(true);
    try {
      await placeOrder(items, address.trim());
      clear();
      setSubmitted(false);
      setOpen(false);
      router.push("/orders");
    } catch (err) {
      setServerError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onMouseDown={() => setOpen(false)}>
      <aside
        className="flex h-full w-full max-w-sm flex-col bg-white p-5 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close cart">
            ×
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="py-6 text-sm text-slate-600">Your cart is empty. Add a dish from the menu.</p>
        ) : (
          <ul className="flex-1 divide-y divide-slate-200 overflow-y-auto">
            {items.map((item) => (
              <CartItem
                key={item.foodId}
                item={item}
                onMinus={() => setQuantity(item.foodId, item.quantity - 1)}
                onPlus={() => setQuantity(item.foodId, item.quantity + 1)}
                onRemove={() => remove(item.foodId)}
              />
            ))}
          </ul>
        )}

        <form onSubmit={onSubmit} noValidate className="mt-4 space-y-3 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Total</span>
            <span className="text-lg font-semibold">{formatPrice(total)}</span>
          </div>

          {user ? (
            <>
              <div>
                <Label htmlFor="address">Delivery address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  error={!!addressError}
                />
                <FieldError message={addressError} />
              </div>
              <FieldError message={serverError} />
              <Button type="submit" className="w-full" disabled={items.length === 0 || saving}>
                {saving ? "Placing order…" : "Place order"}
              </Button>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              <Link href="/login" className="font-medium underline">
                Log in
              </Link>{" "}
              to place your order.
            </p>
          )}
        </form>
      </aside>
    </div>
  );
}
