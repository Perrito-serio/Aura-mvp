// src/components/AuthProvider.tsx
"use client"; // Necesario para usar SessionProvider

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  // SessionProvider necesita envolver el contenido de tu aplicación
  return <SessionProvider>{children}</SessionProvider>;
}