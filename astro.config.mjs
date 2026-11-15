// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static', // Configure for static site generation (SSG)
  site: 'https://www.technicalanxiety.com', // Configure site URL
  trailingSlash: 'ignore', // Let Azure Static Web Apps handle trailing slashes for better 404 compatibility
  integrations: [
    sitemap(), // Generate sitemap.xml
    react(),
  ],
  vite: {
    build: {
      // Never inline fonts as data: URIs. The CSP allows fonts from 'self'
      // only, and separate files get long-lived caching. Other assets keep
      // Vite's default 4 KB inline limit.
      assetsInlineLimit: (filePath) => (/\.(woff2?|ttf|otf)$/.test(filePath) ? false : undefined),
    },
  },
  markdown: {
    shikiConfig: {
      // Use Shiki for syntax highlighting (built into Astro)
      theme: 'github-dark',
      wrap: true,
    },
  },
});
