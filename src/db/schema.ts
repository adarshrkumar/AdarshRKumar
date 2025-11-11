import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const photos = pgTable('photos', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    fullname: varchar('fullname', { length: 255 }).notNull(),
    extention: varchar('extention', { length: 10 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    title: text('title').notNull(),
    uploader: varchar('uploader', { length: 100 }).notNull(),

    // Image object with key and url
    imageKey: text('image_key').notNull(),
    imageUrl: text('image_url').notNull(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
