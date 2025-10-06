import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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