// API endpoint for creating new blog posts in the database
// POST /api/blog/post/new

import type { APIRoute } from 'astro'

import { db } from '../../../../db/initialize.ts'
import { posts } from '../../../../db/schema.ts'

// Helper function to add CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://adarshrkumar.app.n8n.cloud',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        const contentType = request.headers.get('content-type') || '';
        let body: Record<string, string | File> = {};

        // Parse based on content type
        if (contentType.includes('application/json')) {
            // Handle JSON
            body = await request.json();
        }
        else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            // Handle form data
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                body[key] = value;
            }
        }
        else {
            // Try to parse as JSON by default
            try {
                body = await request.json();
            } catch {
                return new Response(
                    JSON.stringify({
                        error: 'Unsupported content type',
                        message: 'Please send JSON or form data',
                        contentType
                    }),
                    {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    }
                );
            }
        }

        // Extract fields with defaults, ensuring they are strings
        const title = typeof body.title === 'string' ? body.title : '';
        const content = typeof body.content === 'string' ? body.content : '';
        const author = typeof body.author === 'string' ? body.author : 'adarshrkumar';
        const categories = typeof body.categories === 'string' ? body.categories : 'general';

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
        let slug: string = typeof body.slug === 'string' ? body.slug : '';
        if (!slug) {
            slug = (typeof title === 'string' ? title : '')
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

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error creating post:', error);

        // Handle duplicate slug error
        if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
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
                message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
};
