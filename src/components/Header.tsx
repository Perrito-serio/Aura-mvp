// src/components/Header.tsx (ACTUALIZADO CON ESTADO DE SESIÓN)
"use client"; // <--- 1. Marcar como Client Component

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react'; // <-- 2. Importar hooks y funciones de NextAuth

export default function Header() {
  // --- 3. Obtener datos de la sesión ---
  const { data: session, status } = useSession();
  // status puede ser 'loading', 'authenticated', 'unauthenticated'
  // session contiene la info del usuario si está autenticado
  // ------------------------------------

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold text-gray-800">
          AURA
        </Link>

        {/* Menú de Navegación */}
        <nav className="hidden md:flex space-x-8 items-center">
          {/* Opcional: Podrías ocultar/mostrar enlaces según la sesión */}
          <Link href="/#try-on-section" className="text-gray-600 hover:text-blue-600 transition-colors">
            Probador
          </Link>
          <Link href="/#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
            Cómo Funciona
          </Link>
          <Link href="/#about" className="text-gray-600 hover:text-blue-600 transition-colors">
            Sobre Nosotros
          </Link>
        </nav>

        {/* --- 4. Botones de Acción Dinámicos --- */}
        <div className="hidden md:flex items-center space-x-4">
          {status === 'loading' && (
            // Mostrar algo mientras carga la sesión (opcional)
            <span className="text-sm text-gray-500">Cargando...</span>
          )}

          {status === 'unauthenticated' && (
            // Mostrar botón de Iniciar Sesión si no está autenticado
            <Link
              href="/login" // Enlazar a tu página de login
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </Link>
            // Opcional: Añadir botón de registro
            // <Link href="/register" className="...">Registrarse</Link>
          )}

          {status === 'authenticated' && session?.user && (
            // Mostrar nombre/email y botón de Cerrar Sesión si está autenticado
            <>
              <span className="text-sm text-gray-700">
                Hola, {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })} // Llama a signOut y redirige a la home
                className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
        {/* -------------------------------------- */}


        {/* Menú para Móviles (Podrías adaptarlo también) */}
        <div className="md:hidden">
          {/* Aquí podrías añadir lógica similar para mostrar Login/Logout en móvil */}
          <button className="text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}