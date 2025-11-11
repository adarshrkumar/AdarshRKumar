// Imports

import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Astro configuration

// https://astro.build/config
export default defineConfig({
    output: 'server',
    site: 'https://adarshrkumar.dev',
    base: '/',
    trailingSlash: 'always',
    adapter: vercel(),
    integrations: [sitemap()],
    vite: {
        server: {
            headers: {
                'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://platform-api.sharethis.com https://api.rss2json.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.rss2json.com https://webshot.adarshrkumar.dev; frame-src 'self' https://www.youtube.com;"
            }
        }
    }
}); 