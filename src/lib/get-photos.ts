// Photo fetching utilities for database-backed photo gallery
// Uses Drizzle ORM to query photos from Vercel Postgres

import { eq, desc } from 'drizzle-orm';
import { db } from '../db/initialize.ts';
import { photos, type Photo } from '../db/schema.ts';

// Helper functions

// Get all photos from database, sorted by creation date (newest first)
export async function getAllPhotos(): Promise<Photo[]> {
    try {
        const allPhotos = await db
            .select()
            .from(photos)
            .orderBy(desc(photos.createdAt));
        return allPhotos;
    } catch (error) {
        console.error('Error fetching photos:', error);
        return [];
    }
}

// Get photos by category
export async function getPhotosByCategory(category: string): Promise<Photo[]> {
    try {
        const categoryPhotos = await db
            .select()
            .from(photos)
            .where(eq(photos.category, category))
            .orderBy(desc(photos.createdAt));
        return categoryPhotos;
    } catch (error) {
        console.error(`Error fetching photos for category ${category}:`, error);
        return [];
    }
}

// Get a single photo by name
export async function getPhotoByName(name: string): Promise<Photo | null> {
    try {
        const result = await db
            .select()
            .from(photos)
            .where(eq(photos.name, name))
            .limit(1);
        return result[0] || null;
    } catch (error) {
        console.error(`Error fetching photo with name ${name}:`, error);
        return null;
    }
}

// Get all unique categories from photos
export async function getPhotoCategories(): Promise<string[]> {
    try {
        const allPhotos = await db.select().from(photos);
        const categories = [...new Set(allPhotos.map(photo => photo.category))];
        return categories.sort();
    } catch (error) {
        console.error('Error fetching photo categories:', error);
        return [];
    }
}

// Format photo for display (helper to match existing PhotoItem interface)
export function formatPhotoForDisplay(photo: Photo) {
    return {
        src: photo.imageUrl,
        alt: photo.title || photo.name,
        fullname: photo.fullname,
        data: {
            title: photo.title,
            fullname: photo.fullname,
            name: photo.name,
            category: photo.category,
            uploader: photo.uploader,
        }
    };
}
