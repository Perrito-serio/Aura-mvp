// src/components/TryOnSection.tsx
"use client";

import { useState, useEffect } from 'react';
import ImageUploader from "@/components/ImageUploader";
import Image from "next/image"; // Importar si es necesario para GarmentCard o ImageUploader

// --- Tipos para las prendas ---
interface Garment {
  id: number;
  name: string;
  imageUrl: string;
  category: string | null;
}

// Componente para las tarjetas de catálogo (ajustado para tamaño en Wardrobe)
const GarmentCard = ({ imageUrl, name, onSelect, isSelected }: {
  imageUrl: string;
  name: string;
  onSelect: () => void;
  isSelected: boolean; // Para resaltar la prenda seleccionada
}) => (
  <div
    className={`relative border rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-300 bg-white group cursor-pointer aspect-square ${isSelected ? 'border-blue-500 border-2' : 'border-gray-200'}`} // Cuadrado y borde si está seleccionado
    onClick={onSelect}
  >
    <Image // Usar Next.js Image para optimización
      src={imageUrl}
      alt={name}
      layout="fill" // Llenar el contenedor
      objectFit="cover" // Cubrir el área manteniendo aspecto
      className="transform group-hover:scale-105 transition-transform duration-300"
    />
    {/* Opcional: Nombre sutil en hover */}
    <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-xs font-semibold capitalize truncate">{name}</p>
    </div>
  </div>
);

export default function TryOnSection() {
  const [allGarmentItems, setAllGarmentItems] = useState<Garment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);

  useEffect(() => {
    // ... (fetchGarments sin cambios) ...
    async function fetchGarments() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/garments');
        if (!response.ok) {
          throw new Error('Error al obtener las prendas');
        }
        const data: Garment[] = await response.json();
        setAllGarmentItems(data);

        const uniqueCategories = Array.from(new Set(data.map(g => g.category).filter(Boolean))) as string[];
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error desconocido');
        console.error("Error fetching garments:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGarments();
  }, []);

  const filteredGarments = selectedCategory
    ? allGarmentItems.filter(item => item.category === selectedCategory)
    : [];

  const handleGarmentSelect = (garment: Garment) => {
    setSelectedGarment(garment);
    console.log("Prenda seleccionada:", garment.name);
  };

  return (
    // Sección principal con fondo gris claro
    <section id="try-on-section" className="bg-gray-100 py-16 px-4 md:px-8 min-h-screen flex items-center justify-center">
      {/* Contenedor principal con sombra y bordes redondeados */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-0"> {/* Gap 0 para unir visualmente */}

        {/* Columna Izquierda: Probador */}
        <div className="md:col-span-2 p-8 md:p-12 flex flex-col items-center justify-center border-r border-gray-200"> {/* Borde derecho en pantallas medianas+ */}
          <header className="text-center mb-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800">Tu Probador Virtual Personal</h2>
            <p className="text-gray-600 mt-2">
              Sube tu foto y explora nuestro catálogo.
            </p>
          </header>
          {/* Componente Uploader con ancho limitado */}
          <div className="w-full max-w-md">
            <ImageUploader />
          </div>
          {/* Puedes añadir aquí un preview de la imagen subida si ImageUploader no lo hace */}
        </div>

        {/* Columna Derecha: Wardrobe */}
        <div className="md:col-span-1 p-6 bg-white flex flex-col"> {/* Fondo blanco explícito */}
          <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Wardrobe</h3>

          {/* --- Pestañas de Categoría --- */}
          <div className="flex justify-center border-b border-gray-200 mb-4">
            {isLoading && <p className="text-sm text-gray-500 py-2 px-4">Cargando...</p>}
            {error && <p className="text-sm text-red-500 py-2 px-4">Error</p>}
            {!isLoading && !error && categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`capitalize font-semibold py-2 px-4 text-sm transition-colors duration-200 border-b-2 ${
                  selectedCategory === category
                    ? 'border-blue-600 text-blue-600' // Estilo activo
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Estilo inactivo
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* --------------------------- */}

          {/* --- Grid de Prendas --- */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar"> {/* Scroll para prendas */}
            {isLoading && <p className="text-center text-gray-500 text-sm mt-4">Cargando prendas...</p>}
            {error && <p className="text-center text-red-500 text-sm mt-4">Error: {error}</p>}
            {!isLoading && !error && selectedCategory && (
              <div className="grid grid-cols-2 gap-4"> {/* Grid 2 columnas */}
                {filteredGarments.length > 0 ? (
                  filteredGarments.map((item) => (
                    <GarmentCard
                      key={item.id}
                      imageUrl={item.imageUrl}
                      name={item.name}
                      onSelect={() => handleGarmentSelect(item)}
                      isSelected={selectedGarment?.id === item.id} // Pasar si está seleccionada
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 text-sm mt-4">No hay prendas.</p>
                )}
              </div>
            )}
          </div>
          {/* ----------------------- */}
        </div>
      </div>
    </section>
  );
}