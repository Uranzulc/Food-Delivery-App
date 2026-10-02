export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(n) {
  return `₮${Number(n || 0).toLocaleString("en-US")}`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
