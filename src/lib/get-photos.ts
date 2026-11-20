import { eq, desc } from 'drizzle-orm';
import db from '../db';
import { photos, type Photo } from '../db/schema';

// Helper functions

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
