
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./Components/CartContext";
import { OrdersProvider } from "./Components/OrdersContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VELORA | The Art of Textiles",
  description: "The Art of Textiles",
  icons: {
    icon: "/velora-logo.png",
    shortcut: "/velora-logo.png",
    apple: "/velora-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrdersProvider>
          <CartProvider>{children}</CartProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}
