"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Sidebar } from "./_components/sidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, ready } = useAuth();
  const allowed = ready && user?.role === "ADMIN";

  useEffect(() => {
    if (ready && user?.role !== "ADMIN") router.replace("/login");
  }, [ready, user, router]);

  if (!allowed) return null;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
