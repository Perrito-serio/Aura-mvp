// scripts/seed-garments.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { garments } from '../src/drizzle/schema';
import * as dotenv from 'dotenv';

// Cargar las variables de entorno desde .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("La variable DATABASE_URL no está definida en .env.local");
  }

  const client = createClient({ url: process.env.DATABASE_URL });
  const db = drizzle(client);

  console.log('Limpiando la tabla de prendas...');
  await db.delete(garments);

  const initialGarments = [
    { name: 'Blue Shirt', imageUrl: '/garments/shirt-1.png', category: 'shirt' },
    { name: 'Summer Dress', imageUrl: '/garments/dress-1.png', category: 'dress' },
    { name: 'Leather Jacket', imageUrl: '/garments/jacket-1.png', category: 'jacket' },
  ];

  console.log('Insertando prendas iniciales en la base de datos...');
  await db.insert(garments).values(initialGarments);
  
  console.log('¡Seed completado con éxito!');
  // Forzamos la salida del proceso para que la terminal no se quede colgada
  process.exit(0);
}

main().catch((err) => {
  console.error("Error durante el proceso de seed:", err);
  process.exit(1);
});