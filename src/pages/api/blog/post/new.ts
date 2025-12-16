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
        // Parse the request body
        const body = await request.json();

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
        console.error('Error details:', {
            message: error?.message,
            code: error?.code,
            detail: error?.detail,
            stack: error?.stack,
            cause: error?.cause
        });

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

        // Return generic error response with more details
        return new Response(
            JSON.stringify({
                error: 'Failed to create post',
                message: error?.message || 'Unknown error',
                code: error?.code,
                detail: error?.detail,
                cause: error?.cause?.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
};
