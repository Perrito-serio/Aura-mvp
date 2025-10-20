// src/app/api/garments/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Asegúrate que la ruta sea correcta
import { garments } from '@/drizzle/schema'; // Asegúrate que la ruta sea correcta

export async function GET(request: Request) {
  try {
    // Consultar todas las prendas en la base de datos usando Drizzle
    const allGarments = await db.select().from(garments);

    // Devolver las prendas como respuesta JSON
    return NextResponse.json(allGarments, { status: 200 });

  } catch (error) {
    console.error('Error al obtener las prendas:', error);
    // Devolver un error genérico en caso de fallo
    return NextResponse.json({ success: false, message: 'Error interno del servidor al obtener prendas.' }, { status: 500 });
  }
}

// Puedes añadir export const dynamic = 'force-dynamic';
// si quieres asegurarte de que esta ruta siempre obtenga datos frescos de la DB
// y no sea cacheada estáticamente por Next.js
export const dynamic = 'force-dynamic';