// src/drizzle/schema.ts (ACTUALIZADO CON TABLAS DE NEXTAUTH)
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// --- Tablas existentes ---
export const garments = sqliteTable('garments', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  imageUrl: text('image_url').notNull(),
  category: text('category'),
});

export const userImages = sqliteTable('user_images', {
  id: integer('id').primaryKey(),
  filename: text('filename').notNull(),
  imageUrl: text('image_url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// --- NUEVAS TABLAS PARA NEXTAUTH ---

// Tabla de Usuarios
export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(), // ID de usuario (generalmente un CUID o UUID)
  name: text("name"),
  email: text("email").notNull().unique(), // Email único
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }), // Fecha de verificación de email
  image: text("image"), // URL de la imagen de perfil
  hashedPassword: text("hashedPassword"), // <-- Añadiremos esto para login con credenciales
});

// Tabla de Cuentas (para OAuth providers como Google, GitHub, etc.)
export const accounts = sqliteTable("account", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<"oauth" | "oidc" | "email">().notNull(), // Tipo de cuenta
  provider: text("provider").notNull(), // Nombre del proveedor (e.g., "google")
  providerAccountId: text("providerAccountId").notNull(), // ID del usuario en el proveedor
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  // Clave primaria compuesta
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

// Tabla de Sesiones (si usas estrategia de sesión "database")
export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

// Tabla de Tokens de Verificación (para email sign-in sin contraseña)
export const verificationTokens = sqliteTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
}, (vt) => ({
  // Clave primaria compuesta
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// --- FIN NUEVAS TABLAS ---