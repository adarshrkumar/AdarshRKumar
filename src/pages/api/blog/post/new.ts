import db from '../../../../db'
import { posts } from '../../../../db/schema'

import type { APIRoute } from 'astro'

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

        if (contentType.includes('application/json')) body = await request.json();
        else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                body[key] = value;
            }
        }
        else {
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

        const title = typeof body.title === 'string' ? body.title : '';
        const content = typeof body.content === 'string' ? body.content : '';
        const author = typeof body.author === 'string' ? body.author : 'adarshrkumar';
        const categories = typeof body.categories === 'string' ? body.categories : 'general';

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

        let slug: string = typeof body.slug === 'string' ? body.slug : '';
        if (!slug) {
            slug = (typeof title === 'string' ? title : '')
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-')         // Replace spaces with hyphens
                .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
                .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
        }

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

        const categoriesStr = Array.isArray(categories)
            ? categories.join(', ')
            : String(categories);

        const newPost = await db.insert(posts).values({
            slug,
            title,
            content,
            author,
            categories: categoriesStr,
        }).returning();

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
