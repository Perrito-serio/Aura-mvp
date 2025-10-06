// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold text-gray-800">
          AURA
        </Link>
        
        {/* Menú de Navegación */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link href="#catalog" className="text-gray-600 hover:text-blue-600 transition-colors">
            Catálogo
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
            Cómo Funciona
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
            Sobre Nosotros
          </Link>
        </nav>
        
        {/* Botón de Acción */}
        <button className="hidden md:inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
          Iniciar Sesión
        </button>

        {/* Menú para Móviles (Opcional, versión simple) */}
        <div className="md:hidden">
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