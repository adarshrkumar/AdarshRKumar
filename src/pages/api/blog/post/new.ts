/**
 * API endpoint for creating new blog posts in the database
 * POST /api/blog/post/new
 */

import type { APIRoute } from 'astro';
import { db } from '../../../../db/db.ts';
import { posts } from '../../../../db/schema.ts';

export const POST: APIRoute = async ({ request }) => {
    try {
        // Parse the request body
        const body = await request.json();

        // Extract fields with defaults
        const {
            title,
            content,
            slug,
            author = 'adarshrkumar',
            categories = 'general'
        } = body;

        // Validate required fields
        if (!title || !content || !slug) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required fields',
                    required: ['title', 'content', 'slug']
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Validate slug format (lowercase, hyphens only, no spaces)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Prepare categories (ensure it's a string)
        const categoriesStr = Array.isArray(categories)
            ? categories.join(', ')
            : String(categories);

        // Insert the new post into the database
        const newPost = await db.insert(posts).values({
            slug,
            title,
            content,
            author,
            categories: categoriesStr,
        }).returning();

        // Return success response with created post
        return new Response(
            JSON.stringify({
                success: true,
                post: newPost[0]
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error: any) {
        console.error('Error creating post:', error);

        // Handle duplicate slug error
        if (error?.code === '23505') {
            return new Response(
                JSON.stringify({
                    error: 'A post with this slug already exists'
                }),
                {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Return generic error response
        return new Response(
            JSON.stringify({
                error: 'Failed to create post',
                details: error?.message || 'Unknown error'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};
