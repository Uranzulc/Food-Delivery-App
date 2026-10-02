import { CartProvider } from "@/providers/cart-provider";
import { Header } from "./_components/header";
import { CartSheet } from "./_features/cart-sheet";

export default function MainLayout({ children }) {
  return (
    <CartProvider>
      <Header />
      <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
      <CartSheet />
    </CartProvider>
  );
}
