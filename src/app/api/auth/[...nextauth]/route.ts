// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db"; // Asegúrate que la ruta sea correcta
import { users, accounts, sessions, verificationTokens } from "@/drizzle/schema"; // Importar todas las tablas necesarias
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

// Asegúrate de tener esta variable en tu .env.local
const AUTH_SECRET = process.env.AUTH_SECRET;

if (!AUTH_SECRET) {
 throw new Error("La variable de entorno AUTH_SECRET no está definida.");
}

const handler = NextAuth({
 // Pasar explícitamente las tablas al adaptador
 adapter: DrizzleAdapter(db, {
   usersTable: users,
   accountsTable: accounts,
   sessionsTable: sessions,
   verificationTokensTable: verificationTokens,
 }),
 providers: [
   CredentialsProvider({
     name: "Credentials",
     // Campos esperados en el formulario de login
     credentials: {
       email: { label: "Email", type: "email", placeholder: "tu@email.com" },
       password: { label: "Password", type: "password" },
     },
     // --- LÓGICA DE AUTORIZACIÓN CON VERIFICACIÓN DE TIPOS MEJORADA ---
     async authorize(credentials, req) {
       // Verificar explícitamente que credentials y sus propiedades existan
       if (!credentials || !credentials.email || !credentials.password) {
         console.log("Faltan credenciales o el objeto es inválido.");
         return null; // Devuelve null si falta algo
       }

       // A partir de aquí, TypeScript sabe que credentials.email y credentials.password son strings
       console.log("Intentando autorizar con DB:", credentials.email);

       try {
         // 1. Buscar usuario en la DB por email
         const result = await db.select()
           .from(users)
           .where(eq(users.email, credentials.email)) // Ahora es seguro usar credentials.email
           .limit(1);

         const user = result[0]; // Obtener el usuario si existe

         if (!user) {
           console.log("Usuario no encontrado:", credentials.email);
           return null; // Usuario no existe
         }

         // 2. Verificar si el usuario tiene contraseña hasheada (importante para CredentialsProvider)
         if (!user.hashedPassword) {
           console.log("Usuario sin contraseña (posiblemente registro social):", user.email);
           return null; // No puede iniciar sesión con contraseña si no tiene una guardada
         }

         // 3. Comparar la contraseña proporcionada con la hasheada en la DB
         const passwordMatch = await bcrypt.compare(
           credentials.password, // Ahora es seguro usar credentials.password
           user.hashedPassword
         );

         if (!passwordMatch) {
           console.log("Contraseña incorrecta para:", user.email);
           return null; // Contraseña incorrecta
         }

         // 4. Si todo es correcto, devolver el objeto usuario (sin el hash)
         // El objeto devuelto debe coincidir con la estructura esperada por NextAuth
         console.log("Usuario autorizado:", user.email);
         return {
           id: user.id, // ID del usuario en tu DB
           name: user.name, // Nombre (puede ser null)
           email: user.email, // Email
           image: user.image, // Imagen de perfil (puede ser null)
           // No incluyas hashedPassword aquí
         };

       } catch (error) {
         console.error("Error durante la autorización:", error);
         return null; // Error interno durante la autorización
       }
     },
     // --- FIN LÓGICA ACTUALIZADA ---
   }),
   // Puedes añadir otros providers (Google, GitHub, etc.) aquí si quieres
 ],
 secret: AUTH_SECRET, // Variable secreta para JWT/sesiones
 session: {
   // Estrategia JWT requerida para CredentialsProvider según el error anterior
   strategy: "jwt",
 },
 // Callbacks para pasar info (como el ID) al token JWT y a la sesión del cliente
 callbacks: {
    async jwt({ token, user }) {
      // Si el objeto 'user' existe (justo después de iniciar sesión),
      // añade el ID de tu base de datos al token JWT.
      if (user) {
        token.id = user.id;
        // Podrías añadir otros campos aquí si los necesitas en el token
        // token.customField = user.customField;
      }
      return token; // Devuelve el token (modificado o no)
    },
    async session({ session, token }) {
      // Pasa la información del token JWT (que incluye el ID que añadimos antes)
      // al objeto 'session' que estará disponible en el cliente (`useSession`).
      if (session.user && token.id) {
        // Añadimos el ID al objeto user de la sesión
        (session.user as any).id = token.id; // Usamos 'as any' o define un tipo extendido para session.user
         // (session.user as any).customField = token.customField;
      }
      return session; // Devuelve la sesión (modificada o no)
    },
  },
 // Opcional: Define rutas personalizadas si no quieres usar las predeterminadas de NextAuth
 // pages: {
 //   signIn: '/login', // Redirige a /login si el usuario necesita iniciar sesión
 //   // signOut: '/auth/signout',
 //   // error: '/auth/error', // Página para mostrar errores de autenticación
 //   // verifyRequest: '/auth/verify-request', // Para verificación de email (ej. magic links)
 //   // newUser: null, // Redirigir a una página específica después del primer registro (null para desactivar)
 // }
});

// Exportar el handler para las rutas GET y POST
export { handler as GET, handler as POST };