"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { count, setOpen } = useCart();

  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-semibold">
          Nine Day Kitchen
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {user && (
            <Link href="/orders" className="rounded-md px-3 py-2 hover:bg-slate-100">
              My orders
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin/dishes" className="rounded-md px-3 py-2 hover:bg-slate-100">
              Admin
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Cart ({count})
          </Button>
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Log out
            </Button>
          ) : (
            <Link href="/login" className="rounded-md px-3 py-2 hover:bg-slate-100">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
