// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static', // Configure for static site generation (SSG)
  site: 'https://technicalanxiety.com', // Configure site URL
  trailingSlash: 'ignore', // Let Azure Static Web Apps handle trailing slashes for better 404 compatibility
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
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress warnings about unused imports in Astro's internal code
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && 
              warning.message.includes('@astrojs/internal-helpers/remote')) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
