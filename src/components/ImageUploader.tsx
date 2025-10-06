// src/components/ImageUploader.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadedImageUrl(null);
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

      setUploadedImageUrl(result.url);
      setStatus('success');

    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <div className="w-full flex justify-center">
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            {file ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>

        {previewUrl && (
          <div className="mt-4 text-center">
            <h3 className="font-semibold text-gray-600 mb-2">Vista Previa:</h3>
            <img src={previewUrl} alt="Vista previa" className="max-w-xs mx-auto h-auto rounded-lg shadow-md" />
          </div>
        )}

        {file && status !== 'uploading' && status !== 'success' && (
            <button type="submit" className="w-full max-w-xs bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300">
                Subir Imagen
            </button>
        )}
      </form>

      <div className="mt-6 text-center min-h-[100px]">
        {status === 'uploading' && <p className="text-blue-500 animate-pulse">Subiendo...</p>}
        {status === 'error' && <p className="text-red-500 font-bold">Error: {error}</p>}
        {status === 'success' && uploadedImageUrl && (
          <div className="flex flex-col items-center gap-4 p-4 bg-green-50 border-2 border-dashed border-green-300 rounded-lg">
            <p className="text-green-700 font-bold text-xl">¡Imagen subida con éxito!</p>
            <img src={uploadedImageUrl} alt="Imagen subida" className="max-w-xs h-auto rounded-lg shadow-lg" />
            <p className="text-sm text-gray-500">Puedes verificar el archivo en la carpeta public/uploads</p>
          </div>
        )}
      </div>
    </section>
  );
}