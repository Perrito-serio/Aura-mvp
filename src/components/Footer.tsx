// src/components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left mb-4 md:mb-0">
          &copy; {currentYear} AURA Virtual Try-On. Todos los derechos reservados.
        </p>
        
        <div className="flex space-x-6">
          <a href="#" className="hover:text-blue-400 transition-colors">Facebook</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Instagram</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}