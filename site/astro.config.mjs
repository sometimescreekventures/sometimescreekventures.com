// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sometimescreekventures.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // The design variants are shareable alternates, not indexable pages.
      filter: (page) =>
        !['/flood', '/os', '/arcade', '/noir', '/zen'].some((v) =>
          new URL(page).pathname.startsWith(v),
        ),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
