/**
 * Legacy image URLs, kept working after the move to Astro's image pipeline.
 *
 * Before images moved to src/assets/img/, the site served every image at
 *   /img/<name>.<ext>                       (originals; og:image, card backgrounds)
 *   /img/optimized/<stem>.{avif,webp,jpg|png} (what post/series/about pages embedded)
 * The site no longer links to either, but external hotlinks, image-search
 * results and "Copy image address" copies might, so the build writes a
 * web-sized copy (max 1200px wide) at each old URL instead of letting it 404.
 *
 * public/img/ still holds the default social image; those names never collide
 * because they aren't in src/assets/img/.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS_DIR = path.join(process.cwd(), 'src', 'assets', 'img');
const ORIGINAL_EXTS = ['.jpg', '.jpeg', '.png'];
const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

type Props = { source: string; format: 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' };

export const getStaticPaths = (() =>
  fs
    .readdirSync(ASSETS_DIR)
    .filter((file) => ORIGINAL_EXTS.includes(path.extname(file).toLowerCase()))
    .flatMap((file) => {
      const ext = path.extname(file).slice(1).toLowerCase() as Props['format'];
      const stem = path.basename(file, path.extname(file));
      // The old OptimizedImage fallback was .png for PNGs and .jpg for everything else
      const fallback = ext === 'png' ? 'png' : 'jpg';
      return [
        { params: { path: file }, props: { source: file, format: ext } },
        { params: { path: `optimized/${stem}.${fallback}` }, props: { source: file, format: fallback } },
        { params: { path: `optimized/${stem}.webp` }, props: { source: file, format: 'webp' } },
        { params: { path: `optimized/${stem}.avif` }, props: { source: file, format: 'avif' } },
      ];
    })) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = async ({ props }) => {
  const image = sharp(path.join(ASSETS_DIR, props.source)).resize({ width: 1200, withoutEnlargement: true });
  const encoders = {
    jpg: () => image.jpeg({ quality: 80, mozjpeg: true }),
    jpeg: () => image.jpeg({ quality: 80, mozjpeg: true }),
    png: () => image.png({ compressionLevel: 9, palette: true }),
    webp: () => image.webp({ quality: 80 }),
    // Low effort keeps CI builds fast; these copies only serve old links
    avif: () => image.avif({ quality: 60, effort: 2 }),
  };
  const body = await encoders[props.format]().toBuffer();

  return new Response(new Uint8Array(body), {
    headers: { 'Content-Type': CONTENT_TYPES[props.format] },
  });
};
