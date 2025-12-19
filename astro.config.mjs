// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static', // Configure for static site generation (SSG)
  site: 'https://technicalanxiety.com', // Configure site URL
  trailingSlash: 'always', // Ensure URLs end with / for Jekyll compatibility (:title/ format)
  integrations: [
    sitemap(), // Generate sitemap.xml
  ],
  markdown: {
    shikiConfig: {
      // Use Shiki for syntax highlighting (built into Astro)
      theme: 'github-dark',
      wrap: true,
    },
  },
});
