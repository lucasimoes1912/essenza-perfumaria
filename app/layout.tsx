import type { Metadata } from "next";
import { Archivo, Bodoni_Moda, DM_Mono } from "next/font/google";
import "./globals.css";
import { store } from "@/lib/config";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${store.name} ${store.tagline} — ${store.slogan}`,
    template: `%s — ${store.name} ${store.tagline}`,
  },
  description: store.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${bodoni.variable} ${archivo.variable} ${dmMono.variable}`}
    >
      <body>
        <CartProvider>
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
