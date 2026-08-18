// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { teamScoresIntegration } from './src/integrations/team-scores.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://supporterapp.github.io',
  integrations: [mdx(), sitemap(), teamScoresIntegration()],
  i18n: {
    defaultLocale: "ca",
    locales: ["ca", "es", "en"],
    routing: {
        prefixDefaultLocale: true
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
