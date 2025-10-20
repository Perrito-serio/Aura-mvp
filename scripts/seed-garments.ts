// scripts/seed-garments.ts (ACTUALIZADO CON 18 PRENDAS)
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { garments } from '../src/drizzle/schema'; // Ajusta la ruta si es necesario
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("La variable DATABASE_URL no está definida en .env.local");
  }

  const client = createClient({ url: process.env.DATABASE_URL });
  const db = drizzle(client);

  console.log('Limpiando la tabla de prendas...');
  await db.delete(garments);

  // Lista completa con las 18 prendas
  const initialGarments = [
    // Shirts (Camisetas/Playeras)
    { name: 'Shirt 1', imageUrl: '/garments/shirts/shirt-1.png', category: 'shirts' },
    { name: 'Shirt 2', imageUrl: '/garments/shirts/shirt-2.png', category: 'shirts' },
    { name: 'Shirt 3', imageUrl: '/garments/shirts/shirt-3.png', category: 'shirts' },
    { name: 'Shirt 4', imageUrl: '/garments/shirts/shirt-4.png', category: 'shirts' },
    { name: 'Shirt 5', imageUrl: '/garments/shirts/shirt-5.png', category: 'shirts' },
    { name: 'Shirt 6', imageUrl: '/garments/shirts/shirt-6.png', category: 'shirts' },

    // Dresses (Vestidos)
    { name: 'Dress 1', imageUrl: '/garments/dresses/dress-1.png', category: 'dresses' },
    { name: 'Dress 2', imageUrl: '/garments/dresses/dress-2.png', category: 'dresses' },
    { name: 'Dress 3', imageUrl: '/garments/dresses/dress-3.png', category: 'dresses' },
    { name: 'Dress 4', imageUrl: '/garments/dresses/dress-4.png', category: 'dresses' },
    { name: 'Dress 5', imageUrl: '/garments/dresses/dress-5.png', category: 'dresses' },
    { name: 'Dress 6', imageUrl: '/garments/dresses/dress-6.png', category: 'dresses' },

    // Jackets (Chaquetas)
    { name: 'Jacket 1', imageUrl: '/garments/jackets/jacket-1.png', category: 'jackets' },
    { name: 'Jacket 2', imageUrl: '/garments/jackets/jacket-2.png', category: 'jackets' },
    { name: 'Jacket 3', imageUrl: '/garments/jackets/jacket-3.png', category: 'jackets' },
    { name: 'Jacket 4', imageUrl: '/garments/jackets/jacket-4.png', category: 'jackets' },
    { name: 'Jacket 5', imageUrl: '/garments/jackets/jacket-5.png', category: 'jackets' },
    { name: 'Jacket 6', imageUrl: '/garments/jackets/jacket-6.png', category: 'jackets' },
  ];

  console.log('Insertando 18 prendas iniciales en la base de datos...');
  await db.insert(garments).values(initialGarments);

  console.log('¡Seed completado con éxito!');
  process.exit(0); // Forzar salida para evitar que la terminal se quede colgada
}

main().catch((err) => {
  console.error("Error durante el proceso de seed:", err);
  process.exit(1);
});