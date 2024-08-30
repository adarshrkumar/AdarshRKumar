import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: "server",
    redirects: {
        '/post/[...slug]': '/blogPost?id=[...slug]',
    }
});
