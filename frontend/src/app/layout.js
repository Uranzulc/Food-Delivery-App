import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { CategoryProvider } from "@/providers/category-provider";
import { DishProvider } from "@/providers/dish-provider";
import { OrderProvider } from "@/providers/order-provider";

export const metadata = { title: "Nine Day Kitchen", description: "Food delivery" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CategoryProvider>
            <DishProvider>
              <OrderProvider>{children}</OrderProvider>
            </DishProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
