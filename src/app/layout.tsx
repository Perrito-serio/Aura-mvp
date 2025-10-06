// src/app/layout.tsx (ACTUALIZADO)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; 

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
      <body className={`${inter.className} flex flex-col min-h-screen`}> {/* 3. Estructura Flex */}
        <Header /> {/* <-- 4. Añadir Header aquí */}
        <main className="flex-grow"> {/* 5. Contenido principal */}
          {children}
        </main>
        <Footer /> {/* <-- 6. Añadir Footer aquí */}
      </body>
    </html>
  );
}