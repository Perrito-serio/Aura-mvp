// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db'; // Importa tu instancia de DB
import { users } from '@/drizzle/schema'; // Importa tu esquema de usuarios
import { eq } from 'drizzle-orm'; // Importa eq para las consultas where

// Define cuántas rondas de salting usar para bcrypt (más es más seguro pero más lento)
const saltRounds = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // --- Validación básica ---
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email y contraseña son requeridos.' }, { status: 400 });
    }
    if (password.length < 6) { // Ejemplo: requerir al menos 6 caracteres
        return NextResponse.json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }
    // Puedes añadir más validaciones (formato de email, etc.)

    // --- Verificar si el usuario ya existe ---
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, message: 'El email ya está registrado.' }, { status: 409 }); // 409 Conflict
    }

    // --- Hashear la contraseña ---
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // --- Crear el nuevo usuario en la base de datos ---
    // Generar un ID único (puedes usar librerías como `cuid` o `uuid` o dejar que la DB lo genere si está configurada)
    // Por simplicidad, usaremos el email como ID temporal si no tienes otra forma configurada
    // ¡OJO! Esto NO es ideal para producción si el email puede cambiar. Mejor usar CUID o UUID.
    const userId = `user_${Date.now()}`; // Ejemplo simple, considera usar algo más robusto

    await db.insert(users).values({
      id: userId,
      email: email,
      hashedPassword: hashedPassword,
      name: name || null, // Guardar nombre si se proporciona
      // emailVerified: null, // Dejar null hasta implementar verificación
      // image: null, // Imagen de perfil por defecto o null
    });

    console.log(`Usuario registrado: ${email}`);

    // Devolver éxito (sin devolver la contraseña)
    return NextResponse.json({ success: true, message: 'Usuario registrado con éxito.' }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor.' }, { status: 500 });
  }
}