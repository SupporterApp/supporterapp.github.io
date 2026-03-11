// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap()],
  i18n: {
    defaultLocale: "en",
    locales: ["ca", "es", "en"],
    routing: {
      preficDefaultLocale: false 
    }

  vite: {
    plugins: [tailwindcss()],
  },
});
