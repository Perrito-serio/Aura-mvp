// src/app/layout.tsx (ACTUALIZADO CON AUTHPROVIDER)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider"; // <-- 1. Importar AuthProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura | Probador Virtual",
  description: "Pruébate ropa desde la comodidad de tu casa con Aura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* 2. Envolver todo el contenido dentro de AuthProvider */}
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
        {/* ----------------------------------------------- */}
      </body>
    </html>
  );
}