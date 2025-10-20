// src/app/page.tsx
import TryOnSection from "@/components/TryOnSection"; // <-- Importa la sección principal
import Link from "next/link";
import Image from "next/image";

// (Puedes mantener o quitar FeatureCard si ya no lo usas en esta página)
const FeatureCard = ({ iconPath, title, description }: { iconPath: string; title: string; description: string; }) => (
  // ... (definición de FeatureCard) ...
  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="p-4 bg-blue-100 rounded-full mb-4">
      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);


export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[600px] flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* ... (contenido del Hero sin cambios) ... */}
        <Image
          src="/hero-banner.webp"
          alt="Persona probándose ropa virtualmente"
          layout="fill"
          objectFit="cover"
          quality={80}
          className="opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-500/50"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight animate-fade-in-up">
            Vístete con el <span className="text-blue-300">futuro</span>.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            Deja de imaginar cómo te quedaría. Sube tu foto y pruébate virtualmente cualquier prenda de nuestro catálogo en segundos.
          </p>
          <Link href="#try-on-section" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 animate-fade-in-up animation-delay-600">
            ¡Pruébalo Ahora!
          </Link>
        </div>
      </section>

      {/* ===== CÓMO FUNCIONA SECTION ===== */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
       {/* ... (contenido de Cómo Funciona sin cambios) ... */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Tan fácil como contar hasta 3</h2>
          <p className="text-gray-600 mt-3 text-lg">Nuestro proceso es simple e intuitivo para transformar tu experiencia de compra.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <FeatureCard
            iconPath="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            title="1. Sube tu foto"
            description="Elige una foto de cuerpo completo donde se te vea claramente y con buena iluminación."
          />
          <FeatureCard
            iconPath="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            title="2. Elige una prenda"
            description="Navega por nuestro catálogo exclusivo y selecciona la ropa que más te guste para probarte."
          />
          <FeatureCard
            iconPath="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            title="3. Ve la magia"
            description="Nuestra IA genera una imagen realista de ti usando la prenda seleccionada. ¡El ajuste es increíble!"
          />
        </div>
      </section>

      {/* ===== TryOnSection COMPONENTE ===== */}
      <TryOnSection />
      {/* ================================== */}

      {/* ===== About/Call to Action Section ===== */}
      <section id="about" className="bg-gray-800 text-white py-20 text-center">
        {/* ... (contenido de About sin cambios) ... */}
         <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforma tu Experiencia de Compra</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            En AURA, creemos que probarse ropa debe ser fácil, divertido y sin estrés. Nuestra tecnología te acerca al futuro de la moda.
          </p>
          <Link href="#try-on-section" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
            ¡Comienza tu Transformación!
          </Link>
        </div>
      </section>
    </div>
  );
}