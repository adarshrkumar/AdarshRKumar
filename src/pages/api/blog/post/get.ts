/**
 * API endpoint for retrieving blog posts from the database
 * GET /api/blog/post/get
 * Supports query parameters: id, slug, title, author, categories, videoId
 */

import type { APIRoute } from 'astro';
import { db } from '../../../../db/initialize.ts';
import { posts } from '../../../../db/schema.ts';
import { eq, and, like } from 'drizzle-orm';

// Helper function to add CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS preflight request
export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
};

export const GET: APIRoute = async ({ url }) => {
    try {
        // Extract query parameters
        const id = url.searchParams.get('id');
        const slug = url.searchParams.get('slug');
        const title = url.searchParams.get('title');
        const author = url.searchParams.get('author');
        const categories = url.searchParams.get('categories');
        const videoId = url.searchParams.get('videoId');

        // Build query conditions
        const conditions = [];

        if (id) {
            conditions.push(eq(posts.id, id));
        }
        if (slug) {
            conditions.push(eq(posts.slug, slug));
        }
        if (title) {
            // Use LIKE for partial title matching
            conditions.push(like(posts.title, `%${title}%`));
        }
        if (author) {
            conditions.push(eq(posts.author, author));
        }
        if (categories) {
            // Use LIKE for category matching (since it's comma-separated)
            conditions.push(like(posts.categories, `%${categories}%`));
        }
        if (videoId) {
            conditions.push(eq(posts.videoId, videoId));
        }

        // If no parameters provided, return error
        if (conditions.length === 0) {
            return new Response(
                JSON.stringify({
                    error: 'No query parameters provided',
                    message: 'Please provide at least one parameter: id, slug, title, author, categories, or videoId',
                    availableParams: ['id', 'slug', 'title', 'author', 'categories', 'videoId']
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Query the database with all conditions
        const result = await db
            .select()
            .from(posts)
            .where(and(...conditions));

        // Return success response with found posts
        return new Response(
            JSON.stringify({
                success: true,
                count: result.length,
                posts: result
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );

    } catch (error: any) {
        console.error('Error retrieving posts:', error);

        // Return generic error response
        return new Response(
            JSON.stringify({
                error: 'Failed to retrieve posts',
                message: error?.message || 'Unknown error'
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
};
