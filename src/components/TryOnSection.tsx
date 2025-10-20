// src/components/TryOnSection.tsx
"use client";

import { useState, useEffect } from 'react';
import ImageUploader from "@/components/ImageUploader";
import Image from "next/image";

interface Garment {
  id: number;
  name: string;
  imageUrl: string;
  category: string | null;
}

const GarmentCard = ({ imageUrl, name, onSelect, isSelected }: {
  imageUrl: string;
  name: string;
  onSelect: () => void;
  isSelected: boolean;
}) => (
  // ... (GarmentCard sin cambios) ...
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
  // Estados para el catálogo
  const [allGarmentItems, setAllGarmentItems] = useState<Garment[]>([]);
  const [isLoadingGarments, setIsLoadingGarments] = useState(true);
  const [garmentError, setGarmentError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // --- NUEVO: Estados para el proceso de TryOn ---
  const [userUploadedImageUrl, setUserUploadedImageUrl] = useState<string | null>(null); // URL de la imagen del usuario
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [tryOnResultImageUrl, setTryOnResultImageUrl] = useState<string | null>(null); // URL de la imagen resultante de Gemini
  const [isProcessingTryOn, setIsProcessingTryOn] = useState(false); // Estado de carga para Gemini
  const [tryOnError, setTryOnError] = useState<string | null>(null); // Errores de la API /api/tryon
  // ---------------------------------------------

  // useEffect para cargar prendas (sin cambios)
  useEffect(() => {
    async function fetchGarments() {
      // ... (lógica fetch sin cambios) ...
       try {
        setIsLoadingGarments(true);
        setGarmentError(null);
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
        setGarmentError(err.message || 'Ocurrió un error desconocido');
        console.error("Error fetching garments:", err);
      } finally {
        setIsLoadingGarments(false);
      }
    }
    fetchGarments();
  }, []);

  const filteredGarments = selectedCategory
    ? allGarmentItems.filter(item => item.category === selectedCategory)
    : [];

  // --- CAMBIO: Función para manejar la subida exitosa de la imagen del usuario ---
  const handleUserImageUpload = (url: string) => {
    setUserUploadedImageUrl(url);
    setTryOnResultImageUrl(null); // Limpiar resultado anterior si se sube nueva imagen
    setTryOnError(null);
    console.log("Imagen de usuario lista:", url);
  };
  // -------------------------------------------------------------------------

  // --- CAMBIO: Lógica para llamar a la API /api/tryon ---
  const handleGarmentSelect = async (garment: Garment) => {
    setSelectedGarment(garment); // Marcar la prenda seleccionada visualmente
    setTryOnResultImageUrl(null); // Limpiar resultado anterior
    setTryOnError(null); // Limpiar error anterior

    // Verificar si hay una imagen de usuario subida
    if (!userUploadedImageUrl) {
      setTryOnError("Por favor, sube tu imagen primero.");
      return;
    }

    setIsProcessingTryOn(true); // Iniciar estado de carga

    console.log("Iniciando TryOn con:", { user: userUploadedImageUrl, garment: garment.imageUrl });

    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userImageUrl: userUploadedImageUrl, // Enviar URL de la imagen del usuario
          garmentImageUrl: garment.imageUrl, // Enviar URL de la prenda seleccionada
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error en la API de TryOn.');
      }

      // Éxito: guardar la URL de la imagen resultante (Data URL)
      setTryOnResultImageUrl(result.resultImageUrl);
      console.log("TryOn completado.");

    } catch (err: any) {
      console.error("Error durante el TryOn:", err);
      setTryOnError(err.message || 'Ocurrió un error al procesar la imagen.');
    } finally {
      setIsProcessingTryOn(false); // Finalizar estado de carga
    }
  };
  // --------------------------------------------------

  return (
    <section id="try-on-section" className="bg-gray-100 py-16 px-4 md:px-8 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-0">

        {/* Columna Izquierda: Probador */}
        <div className="md:col-span-2 p-8 md:p-12 flex flex-col items-center justify-start border-r border-gray-200"> {/* justify-start */}
          <header className="text-center mb-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800">Tu Probador Virtual Personal</h2>
            <p className="text-gray-600 mt-2">
              1. Sube tu foto 
              {/* <span className="text-gray-400"> | </span> */}
               2. Selecciona una prenda
            </p>
          </header>

          {/* Área de Visualización (Imagen de usuario O resultado de Gemini) */}
          <div className="w-full max-w-md aspect-[3/4] bg-gray-200 rounded-lg mb-6 relative flex items-center justify-center overflow-hidden">
            {isProcessingTryOn && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
                <p className="text-white text-lg font-semibold animate-pulse">Procesando...</p>
                <p className="text-gray-300 text-sm mt-1">La IA está trabajando...</p>
              </div>
            )}
            {tryOnError && !isProcessingTryOn && (
                 <div className="absolute inset-0 bg-red-100 bg-opacity-90 flex flex-col items-center justify-center z-10 p-4">
                    <p className="text-red-700 font-bold text-center">Error al probar</p>
                    <p className="text-red-600 text-sm mt-1 text-center">{tryOnError}</p>
                 </div>
            )}

            {/* Mostrar resultado de Gemini si existe, si no, la imagen del usuario */}
            {(tryOnResultImageUrl || userUploadedImageUrl) ? (
               <Image
                 src={tryOnResultImageUrl || userUploadedImageUrl!} // Prioriza resultado, luego usuario
                 alt={tryOnResultImageUrl ? "Resultado Try-On" : "Imagen de Usuario"}
                 layout="fill"
                 objectFit="contain" // 'contain' para ver toda la persona
                 priority={!!tryOnResultImageUrl} // Cargar prioritariamente el resultado
               />
            ) : (
                <p className="text-gray-500">Sube tu imagen aquí</p> // Placeholder inicial
            )}
          </div>


          {/* Componente Uploader debajo del visualizador */}
          <div className="w-full max-w-md">
            {/* Pasar la función handler al ImageUploader */}
            <ImageUploader onUploadSuccess={handleUserImageUpload} />
          </div>
        </div>

        {/* Columna Derecha: Wardrobe */}
        <div className="md:col-span-1 p-6 bg-white flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Wardrobe</h3>

          {/* Pestañas de Categoría */}
          <div className="flex justify-center border-b border-gray-200 mb-4">
             {isLoadingGarments && <p className="text-sm text-gray-500 py-2 px-4">Cargando...</p>}
             {garmentError && <p className="text-sm text-red-500 py-2 px-4">Error</p>}
             {!isLoadingGarments && !garmentError && categories.map(category => (
                <button
                    key={category}
                    onClick={() => {
                        setSelectedCategory(category);
                        // Opcional: Limpiar selección/resultado al cambiar categoría
                        // setSelectedGarment(null);
                        // setTryOnResultImageUrl(null);
                        // setTryOnError(null);
                    }}
                    className={`capitalize font-semibold py-2 px-4 text-sm transition-colors duration-200 border-b-2 ${
                    selectedCategory === category
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {category}
                </button>
             ))}
          </div>

          {/* Grid de Prendas */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[400px]"> {/* Altura mínima */}
            {isLoadingGarments && <p className="text-center text-gray-500 text-sm mt-4">Cargando...</p>}
            {garmentError && <p className="text-center text-red-500 text-sm mt-4">Error: {garmentError}</p>}
            {!isLoadingGarments && !garmentError && selectedCategory && (
              <div className="grid grid-cols-2 gap-3"> {/* Gap más pequeño */}
                {filteredGarments.length > 0 ? (
                  filteredGarments.map((item) => (
                    <GarmentCard
                      key={item.id}
                      imageUrl={item.imageUrl}
                      name={item.name}
                      onSelect={() => handleGarmentSelect(item)} // Llama a la nueva función
                      isSelected={selectedGarment?.id === item.id}
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 text-sm mt-4">No hay prendas.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}