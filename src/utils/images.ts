/**
 * Image helpers for content images (post, series and default images).
 *
 * Content images live in src/assets/img/ and are referenced from front matter
 * with a relative path (validated by image() in content.config.ts). Astro
 * generates the optimized files at build time; nothing is pre-processed.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import defaultPostImage from '../assets/img/article-header.jpg';

export { defaultPostImage };

/** Social card size (og:image): 1.91:1. */
export const SOCIAL_IMAGE = { width: 1200, height: 630 } as const;

/**
 * Path of a 1200x630 JPEG for og:image (BaseLayout makes it absolute).
 * Originals come in any shape (portrait included), so crop toward the most
 * salient region (sharp's 'attention') rather than the center: a center crop
 * of a portrait sign cuts off its top lines.
 */
export async function socialImageSrc(image: ImageMetadata): Promise<string> {
  const result = await getImage({ src: image, ...SOCIAL_IMAGE, fit: 'cover', position: 'attention', format: 'jpg' });
  return result.src;
}

/**
 * URL for a CSS background-image (cards and featured tiles). Those elements
 * crop with background-size: cover, so only the width matters. WebP is
 * supported by every browser the site targets.
 */
export async function backgroundImageUrl(image: ImageMetadata | undefined, width: number): Promise<string> {
  const result = await getImage({ src: image ?? defaultPostImage, width, format: 'webp' });
  return result.src;
}
