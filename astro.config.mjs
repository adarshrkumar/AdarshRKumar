import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    '/post/[...slug]': '/blogPost?id=[...slug]',
});
