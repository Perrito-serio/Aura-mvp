// src/components/ImageUploader.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// --- NUEVO: Añadir prop onUploadSuccess ---
interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void; // Función que se llamará con la URL
}
// ------------------------------------------

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) { // <-- Usar la prop
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Ya no necesitamos guardar uploadedImageUrl aquí, lo pasaremos hacia arriba
  // const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // setUploadedImageUrl(null); // Ya no es necesario
      setError(null);
      setStatus('idle');

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo primero.');
      return;
    }

    setStatus('uploading');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al subir la imagen.');

      // --- CAMBIO: Llamar a onUploadSuccess en lugar de guardar localmente ---
      // setUploadedImageUrl(result.url);
      onUploadSuccess(result.url); // Notificar al componente padre con la URL
      // -------------------------------------------------------------------
      setStatus('success');

    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    // --- CAMBIO: Ajustar diseño para que encaje mejor en la columna izquierda ---
    <section className="bg-white p-6 rounded-xl border border-gray-200">
    {/* ---------------------------------------------------------------------- */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        {/* Vista previa y botón de selección/cambio */}
        <div className="w-full flex flex-col items-center gap-4">
          {previewUrl ? (
            <div className="text-center">
              {/* <h3 className="font-semibold text-gray-600 mb-2 text-sm">Vista Previa:</h3> */}
              <img src={previewUrl} alt="Vista previa" className="w-48 h-auto object-contain rounded-lg shadow-md mb-4 mx-auto" />
              <label htmlFor="file-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 underline">
                Cambiar Imagen
              </label>
            </div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm">
              Seleccionar Imagen
            </label>
          )}
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>

        {/* Botón de Subir (solo si hay archivo y no se ha subido) */}
        {file && status !== 'uploading' && status !== 'success' && (
            <button type="submit" className="w-full max-w-xs bg-green-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-600 transition-colors duration-300 text-sm">
                Subir Imagen
            </button>
        )}
      </form>

      {/* Mensajes de estado */}
      <div className="mt-4 text-center min-h-[20px]">
        {status === 'uploading' && <p className="text-blue-500 text-sm animate-pulse">Subiendo...</p>}
        {status === 'error' && <p className="text-red-500 font-semibold text-sm">Error: {error}</p>}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-1 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-bold text-sm">¡Imagen lista!</p>
            {/* Ya no mostramos la imagen aquí, solo el mensaje */}
          </div>
        )}
      </div>
    </section>
  );
}