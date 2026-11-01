// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './src/consts.ts';

// `overrides.vite` a package.json fixa Vite a la v7, que és la que demana
// Astro 6. Sense això, @tailwindcss/vite arrossegava la v8 i els tipus del
// plugin no encaixaven amb els d'Astro.

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // `/` no té pàgina pròpia: redirigim a l'idioma per defecte. Astro genera
  // aquesta redirecció tant a `astro dev` com al build estàtic, així que
  // http://localhost:4321/ funciona igual que a producció.
  redirects: {
    '/': '/ca/',
  },
  integrations: [mdx(), sitemap()],
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
