#!/usr/bin/env node

/**
 * Pre-publish checks for a technicalanxiety backlog post.
 *
 * Usage (from the repo root):
 *   node .claude/skills/prepare-post/scripts/check-post.mjs <slug | path/to/post.md>
 *
 * Prints ERROR (blocks publishing), WARN (needs a decision) and OK lines.
 * Exits 1 if there are any errors. Read-only: it never edits files.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'src', 'content');
const IMG = path.join(ROOT, 'public', 'img');
const FIELD_ORDER = ['title', 'date', 'tags', 'series', 'series_part', 'description', 'image', 'author', 'draft'];

const results = [];
const error = msg => results.push(['ERROR', msg]);
const warn = msg => results.push(['WARN ', msg]);
const ok = msg => results.push(['OK   ', msg]);

function parse(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;
  const raw = {};
  const keys = [];
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      keys.push(kv[1]);
      raw[kv[1]] = kv[2].trim();
    }
  }
  const unquote = v => (v ?? '').replace(/^["']|["']$/g, '');
  const data = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, unquote(v)]));
  data.tags = (raw.tags ?? '').replace(/^\[|\]$/g, '').split(',').map(unquote).map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  return { text, raw, data, keys, body: match[2] };
}

function listPosts(collection) {
  const dir = path.join(CONTENT, collection);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => ({ collection, file: f, ...parse(path.join(dir, f)) }))
    : [];
}

function jpegSize(file) {
  // Read width/height from the JPEG SOF marker (no dependencies)
  const buf = fs.readFileSync(file);
  for (let i = 2; i < buf.length - 9;) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

// --- Resolve the post ---------------------------------------------------------
const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node .claude/skills/prepare-post/scripts/check-post.mjs <slug | path>');
  process.exit(2);
}
const slug = path.basename(arg, '.md');
const file = path.join(CONTENT, 'backlog', `${slug}.md`);
if (!fs.existsSync(file)) {
  console.error(`Not found: src/content/backlog/${slug}.md`);
  process.exit(2);
}
const post = parse(file);
if (!post) {
  console.error('No front matter found');
  process.exit(2);
}
const { raw, data, keys, body } = post;
const published = listPosts('posts');
const backlog = listPosts('backlog');

// --- Front matter -------------------------------------------------------------
for (const field of ['title', 'date', 'tags', 'description', 'image']) {
  if (!raw[field]) error(`Missing front matter field: ${field}`);
}
if (raw.layout) error('Remove Jekyll field: layout');
if (raw.series_order) error('Use series_part, not series_order (series_order fails the build)');
for (const k of keys) {
  if (!FIELD_ORDER.includes(k) && k !== 'series_order' && k !== 'layout') warn(`Unknown front matter field: ${k}`);
}
const known = keys.filter(k => FIELD_ORDER.includes(k));
const expected = [...known].sort((a, b) => FIELD_ORDER.indexOf(a) - FIELD_ORDER.indexOf(b));
if (known.join() !== expected.join()) warn(`Field order should be: ${expected.join(', ')}`);
if (raw.title && !/^".*"$/.test(raw.title)) warn('Quote the title: title: "..."');
if (raw.description && !/^".*"$/.test(raw.description)) warn('Quote the description');
if (raw.image && !/^".*"$/.test(raw.image)) warn(`Quote the image: image: "${data.image}"`);
if (raw.tags && /"/.test(raw.tags)) warn('Tags are unquoted in the template: tags: [Leadership, Anxiety]');
if (raw.date && !/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) error(`Date must be YYYY-MM-DD, got: ${raw.date}`);

const len = data.description?.length ?? 0;
if (len && (len < 150 || len > 160)) warn(`Description is ${len} characters (target 150-160)`);
else if (len) ok(`Description is ${len} characters`);

const knownTags = new Set(published.flatMap(p => p.data?.tags ?? []));
const newTags = data.tags.filter(t => !knownTags.has(t));
if (newTags.length) warn(`Tags not used by any published post: ${newTags.join(', ')}`);

const today = new Date().toISOString().slice(0, 10);
if (raw.date) {
  ok(raw.date <= today
    ? `Date ${raw.date} is today or earlier: publishes at the next 9 AM UTC run after push`
    : `Date ${raw.date} is in the future: publishes at 9 AM UTC that day`);
}

// --- Body ---------------------------------------------------------------------
const h1 = body.match(/^# .+$/m);
if (h1) error(`Remove the body H1 (the layout renders the title): ${h1[0]}`);

const selfLinks = [...body.matchAll(/\]\((https?:\/\/(?:www\.)?technicalanxiety\.com(\/[^)]*)?)\)/g)];
for (const m of selfLinks) error(`Use a relative link: ${m[1]} -> ${m[2] || '/'}`);

const publishedSlugs = new Set(published.map(p => p.file.replace(/\.md$/, '')));
for (const m of body.matchAll(/\]\((\/[a-z0-9-]+)\/?(#[^)]*)?\)/g)) {
  const target = m[1].slice(1);
  const isPage = fs.existsSync(path.join(ROOT, 'src', 'pages', `${target}.astro`)) || ['series', 'tags', 'archive', 'search'].includes(target);
  if (!publishedSlugs.has(target) && !isPage) {
    const inBacklog = backlog.some(p => p.file === `${target}.md`);
    (inBacklog ? warn : error)(`Internal link /${target}/ ${inBacklog ? 'is still in the backlog' : 'does not match any published post'}`);
  }
  if (!m[0].includes(`${m[1]}/`)) warn(`Internal link missing trailing slash: ${m[1]}`);
}

const attribution = body.match(/\*\*Photo by \[[^\]]+\]\(https:\/\/unsplash\.com\/@[^)]+\) on \[Unsplash\]\(https:\/\/unsplash\.com\/photos\/[^)]+\)\*\*\s*$/);
if (attribution) ok('Unsplash attribution is last, in the standard format');
else if (/unsplash/i.test(body)) error('Unsplash attribution is not in the standard format or not at the end');
else error('Missing Unsplash attribution');

// --- Image --------------------------------------------------------------------
if (data.image) {
  const src = path.join(IMG, data.image);
  const stem = path.parse(data.image).name;
  if (!fs.existsSync(src)) {
    error(`Image not found: public/img/${data.image}`);
  } else {
    const size = /\.jpe?g$/i.test(data.image) ? jpegSize(src) : null;
    const kb = Math.round(fs.statSync(src).size / 1024);
    if (size && (size.width !== 1200 || size.height !== 630)) {
      error(`public/img/${data.image} is ${size.width}x${size.height}, ${kb}KB: run node optimize-images.js`);
    } else if (size) {
      ok(`Image is 1200x630, ${kb}KB`);
    }
    const variants = ['avif', 'webp', path.parse(data.image).ext.slice(1)].map(ext => path.join(IMG, 'optimized', `${stem}.${ext}`));
    const missing = variants.filter(v => !fs.existsSync(v));
    if (missing.length) error(`Missing optimized versions: ${missing.map(v => path.relative(ROOT, v)).join(', ')}`);
    else {
      const sizes = variants.map(v => `${path.extname(v).slice(1)} ${Math.round(fs.statSync(v).size / 1024)}KB`);
      const big = variants.filter(v => fs.statSync(v).size > 200 * 1024);
      (big.length ? warn : ok)(`Optimized versions: ${sizes.join(', ')}${big.length ? ' (over the 200KB target)' : ''}`);
    }
  }
}

// --- Series -------------------------------------------------------------------
if (data.series) {
  const pages = fs.readdirSync(path.join(CONTENT, 'series')).filter(f => f.endsWith('.md'))
    .map(f => ({ file: f, ...parse(path.join(CONTENT, 'series', f)) }));
  const page = pages.find(p => p.data.title === data.series);
  if (!page) {
    const close = pages.find(p => p.data.title.toLowerCase() === data.series.toLowerCase());
    error(close
      ? `series: "${data.series}" must exactly match the series page title "${close.data.title}" (${close.file})`
      : `No series page with title "${data.series}" in src/content/series/ (create one)`);
  } else {
    ok(`Series page: src/content/series/${page.file}`);
  }

  const part = Number(data.series_part);
  const siblings = [...published, ...backlog].filter(p => p.data?.series === data.series && p.file !== `${slug}.md`);
  if (!data.series_part) {
    error('Series post is missing series_part');
  } else {
    const taken = siblings.find(p => Number(p.data.series_part) === part);
    if (taken) error(`series_part ${part} is already used by ${taken.collection}/${taken.file}`);
    const parts = [...siblings.map(p => Number(p.data.series_part)), part].sort((a, b) => a - b);
    if (parts.some((p, i) => p !== i + 1)) warn(`Series parts are not 1..N without gaps: ${parts.join(', ')}`);

    if (page) {
      const listed = page.body.match(new RegExp(`\\*\\*Part ${part}\\b`));
      (listed ? ok : error)(listed
        ? `Series page lists Part ${part}`
        : `Series page ${page.file} has no "**Part ${part}: ...**" entry under What You'll Learn`);
      if (page.data.image && !fs.existsSync(path.join(IMG, page.data.image))) error(`Series page image not found: public/img/${page.data.image}`);
    }

    const prev = siblings.find(p => Number(p.data.series_part) === part - 1);
    if (part > 1 && !prev) {
      warn(`No Part ${part - 1} found for this series`);
    } else if (prev) {
      const pointsHere = prev.text.includes(`<!-- NEXT_PART: ${slug}.md -->`) || prev.text.includes(`](/${slug}/)`);
      const nextPart = prev.text.match(/<!-- NEXT_PART: (\S+) -->/);
      if (pointsHere) ok(`Part ${part - 1} (${prev.collection}/${prev.file}) links to this post`);
      else if (nextPart) error(`Part ${part - 1} (${prev.collection}/${prev.file}) has NEXT_PART: ${nextPart[1]}, should be ${slug}.md`);
      else error(`Part ${part - 1} (${prev.collection}/${prev.file}) has no What's Next block pointing here`);
    }
  }

  const next = body.match(/<!-- NEXT_PART: (\S+) -->/);
  if (next) {
    const target = next[1];
    const exists = backlog.some(p => p.file === target) || published.some(p => p.file === target);
    (exists ? ok : warn)(exists
      ? `What's Next points to ${target}`
      : `What's Next points to ${target}, which doesn't exist yet in backlog/ (fine if it's coming; the filename must match exactly)`);
    if (!/^## What's Next\?\s*$/m.test(body)) warn('Add a "## What\'s Next?" heading above the NEXT_PART block');
    if (!/<!-- END_NEXT_PART -->/.test(body)) error('NEXT_PART block has no <!-- END_NEXT_PART --> marker');
  } else {
    warn('No What\'s Next block: correct only if this is the last part');
  }
}

// --- Report -------------------------------------------------------------------
console.log(`Checks for src/content/backlog/${slug}.md\n`);
for (const level of ['ERROR', 'WARN ', 'OK   ']) {
  for (const [l, msg] of results) if (l === level) console.log(`${l}  ${msg}`);
}
const errors = results.filter(([l]) => l === 'ERROR').length;
console.log(`\n${errors} error(s), ${results.filter(([l]) => l === 'WARN ').length} warning(s)`);
process.exit(errors ? 1 : 0);
