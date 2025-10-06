// src/app/page.tsx
import ImageUploader from "@/components/ImageUploader";

export default function HomePage() {
  const garmentImages = [
    "shirt-1.png",
    "dress-1.png",
    "jacket-1.png",
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">Aura Virtual Try-On</h1>
          <p className="text-lg text-gray-500 mt-2">Sube una foto tuya para comenzar</p>
        </header>

        <ImageUploader />

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nuestro Catálogo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {garmentImages.map((imageName) => (
              <div key={imageName} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
                <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-400">Imagen de {imageName}</p>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-700 capitalize">{imageName.split('.')[0].replace('-', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}