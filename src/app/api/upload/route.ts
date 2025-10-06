import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { userImages } from '@/drizzle/schema';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No se encontró el archivo.' }, { status: 400 });
    }
    
    // Validaciones
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, message: 'Tipo de archivo no permitido.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = path.join(process.cwd(), 'public/uploads', filename);

    // Guardar el archivo en el sistema
    await writeFile(filePath, buffer);
    console.log(`Archivo guardado en: ${filePath}`);

    const publicUrl = `/uploads/${filename}`;

    // Guardar registro en la base de datos
    await db.insert(userImages).values({
      filename: filename,
      imageUrl: publicUrl,
      createdAt: new Date(),
    });
    console.log('Registro guardado en la base de datos.');
    
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor.' }, { status: 500 });
  }
}