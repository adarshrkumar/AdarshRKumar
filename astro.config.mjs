import { defineConfig } from 'astro/config';
import node from '@astro/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});