/**
 * API endpoint for creating new blog posts in the database
 * POST /api/blog/post/new
 */

import type { APIRoute } from 'astro';
import { db } from '../../../../db/initialize.ts';
import { posts } from '../../../../db/schema.ts';

// Helper function to add CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',//'https://adarshrkumar.app.n8n.cloud',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS preflight request
export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
};

export const POST: APIRoute = async ({ request }) => {
    try {
        // Log request details for debugging
        console.log('Content-Type:', request.headers.get('content-type'));

        // Get raw body text first
        const rawBody = await request.text();
        console.log('Raw body:', rawBody);

        // Parse the request body
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (jsonError) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid JSON',
                    message: 'Request body must be valid JSON',
                    received: rawBody.substring(0, 100)
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Extract fields with defaults
        const {
            title,
            content,
            author = 'adarshrkumar',
            categories = 'general'
        } = body;

        // Validate required fields
        if (!title || !content) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required fields',
                    required: ['title', 'content']
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Generate slug from title if not provided
        let slug = body.slug;
        if (!slug) {
            slug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-')          // Replace spaces with hyphens
                .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
                .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
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
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Return generic error response
        return new Response(
            JSON.stringify({
                error: 'Failed to create post',
                message: error?.message || 'Unknown error'
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
};
