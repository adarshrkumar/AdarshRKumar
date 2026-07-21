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

export const posts = pgTable('posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    videoId: varchar('video_id', { length: 100 }),
    author: varchar('author', { length: 100 }).notNull(),
    categories: text('categories').notNull(), // Comma-separated categories

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Photo = typeof photos.$inferSelect;
export type Post = typeof posts.$inferSelect;