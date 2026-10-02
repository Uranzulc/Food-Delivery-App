import { cn } from "@/lib/utils";

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-400",
        error ? "border-red-500" : "border-slate-300",
        className
      )}
      {...props}
    />
  );
}
