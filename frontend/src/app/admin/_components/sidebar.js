"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
const links = [
  { href: "/admin/dishes", label: "Dishes" },
  { href: "/admin/orders", label: "Orders" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <aside className="flex shrink-0 flex-col gap-4 border-b border-slate-200 p-4 md:w-52 md:border-b-0 md:border-r">
     <Image/>

      <nav className="flex gap-2 md:flex-col">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm",
              pathname.startsWith(l.href) ? "bg-slate-900 text-white" : "hover:bg-slate-100"
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-2 text-sm">
        <p className="truncate text-slate-600">{user?.email}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Log out
        </Button>
      </div>
    </aside>
  );
}
