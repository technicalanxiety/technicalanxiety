---
name: prepare-post
description: Prepare a technicalanxiety.com backlog post for publishing - clean up front matter, fix internal links, add the Unsplash photo attribution, process the featured image with optimize-images.js, and check series wiring (series page, series_part, What's Next / NEXT_PART block, previous part's link). Use this whenever Jason asks to prepare, clean up, finish, ready, or schedule a post in src/content/backlog/, gives an Unsplash photo/author link for a post, swaps a post's photo, or adds a new part to a series - even if he doesn't say "prepare".
---

# Prepare a backlog post for publishing

Posts live in `src/content/backlog/<slug>.md` until the daily workflow (9 AM UTC)
moves any post dated today or earlier into `src/content/posts/`. The filename is
the URL: `<slug>.md` → `/<slug>/`. Your job is to get a post fully ready for that
move without touching the writing itself.

**Don't edit the prose.** Jason writes the post. Change front matter, links,
the attribution line and series wiring only. If something in the text looks
wrong (a typo, a broken sentence), mention it and let him decide.

## Inputs

Usually given in the request; ask for anything missing before you start:

- The post: a slug or path in `src/content/backlog/`
- Unsplash **photo link** (`https://unsplash.com/photos/...`), **author link**
  (`https://unsplash.com/@...`) and **author name**
- The image: normally Jason has already saved the downloaded original to
  `public/img/<slug>.jpg`. Check the front matter `image:` and `public/img/`
  rather than asking.

## Step 1: Run the checker

```bash
node .claude/skills/prepare-post/scripts/check-post.mjs <slug>
```

It's read-only and reports ERROR / WARN / OK lines for everything below. Use it
as your to-do list, then run it again at the end. It knows the repo's rules, so
trust it over memory, but treat WARN lines as decisions, not automatic fixes.

## Step 2: Front matter

Match the template in `.github/QUICK_REFERENCE.md` (schema:
`src/content.config.ts`). Field order and quoting:

```yaml
---
title: "Post Title"
date: 2026-01-15
tags: [Leadership, Anxiety]
series: "Series Name"        # series posts only
series_part: 2               # series posts only; never series_order
description: "150-160 characters"
image: "slug.jpg"
---
```

- Tags unquoted, from existing tags where possible (the checker lists new ones;
  a new tag is fine if Jason means it, so ask).
- Description 150-160 characters. If it's outside that range, propose a
  rewrite and let Jason choose; it's his voice.
- Remove a `# Title` H1 at the top of the body: the layout already renders the
  title, so it would appear twice.
- Leave `date` alone unless asked. Tell Jason when it will publish: the next
  9 AM UTC run on or after that date. If today's run has passed, that's tomorrow.

## Step 3: Links

Links to Jason's own articles are relative with a trailing slash:
`[I wrote before](/cost-of-being-the-canary/)`, never
`https://www.technicalanxiety.com/...`. External links stay as they are. The
checker flags absolute self-links, missing trailing slashes, and slugs that
don't match a published post.

## Step 4: Unsplash attribution

The last thing in the post, after a `---` divider, in exactly this format:

```markdown
---

**Photo by [Author Name](https://unsplash.com/@username) on [Unsplash](https://unsplash.com/photos/photo-slug-id)**
```

When the photo changes, replace the existing line instead of adding another.

## Step 5: Image

`public/img/` holds the **uncropped original**. Don't crop or resize it
yourself, because `optimize-images.js` needs the full-size file:

```bash
node optimize-images.js
```

For any image named in a post's `image:` front matter that isn't already
1200x630, it center-crops from the original, writes
`public/img/optimized/<slug>.{avif,webp,jpg}`, and replaces the original with
the 1200x630 version (that path is the og:image and card background). So the
`image:` front matter must be in place before you run it, or the image is only
resized, not cropped.

Then **look at the crop**: the center crop can cut off an off-center subject.
Read `public/img/<slug>.jpg` as an image and describe what's in frame. If the
subject is clipped, say so. The fix is for Jason to crop the original to about
1.9:1 around the subject, then rerun.

Things to know:

- The script skips images whose optimized versions are newer than the source,
  using file timestamps. After a `git checkout` or `git restore`, it may redo
  unrelated images. Only `.avif` files actually change (the bytes differ by
  encoder version), so run `git restore public/img/optimized/` on anything
  that isn't this post's image.
- If the post's photo changed, the new original just replaces
  `public/img/<slug>.jpg`. Its newer timestamp makes the script reprocess it.
- Report the output sizes. Over 200KB for a featured image deserves a mention;
  grainy photos can make AVIF bigger than the JPG.

## Step 6: Series posts

Skip this step if there's no `series:` field. Otherwise a series has four
parts that have to agree, and none of them fail the build when they don't.
Mismatches silently drop the post from series navigation:

1. **Series page.** `src/content/series/<name>.md` must have a `title:` that
   exactly matches the post's `series:` value, including capitalization and
   spacing. For a new series, the page needs creating. Copy the structure of an
   existing page (`title`, `description`, `image`, `tags`, `order`, `featured`;
   body sections Overview, The Core Problem, What You'll Learn, ...). Ask Jason
   for the content rather than writing it, and pick an `order` no other page
   uses. Its image goes through `optimize-images.js` the same way.
2. **Part number.** Use `series_part: N`, the next number with no gap or
   duplicate. `series_order` fails the build on purpose.
3. **What You'll Learn.** The series page lists every part as
   `**Part N: Title**` followed by a one-line summary. Add this part if it's
   missing, and ask Jason for the summary line if you can't take it straight
   from the post's description.
4. **What's Next blocks.**
   - This post (unless it's the last part, so ask if unsure) ends with this
     block, just before the attribution `---`:

     ```markdown
     ## What's Next?

     <!-- NEXT_PART: next-part-slug.md -->
     **Coming Next:** Part 3: Part Title (Publishing January 22, 2026)

     One or two sentences teasing what the next part covers.
     <!-- END_NEXT_PART -->
     ```

     `NEXT_PART` is the next part's exact filename, with no date prefix.
     `scripts/update-series-links.js` (run by the publish workflow and by
     `npm run backlog publish`) replaces the whole block with
     `**Next in Series:** [Title →](/slug/)` once that file is published.
     A filename that doesn't match means the placeholder never gets replaced.
   - The **previous part** (in `backlog/` or already in `posts/`) needs the
     same block with `NEXT_PART: <this-slug>.md`. If it's already published,
     adding the block there is correct: the link fills in when this post
     publishes.

## Step 7: Verify

```bash
node .claude/skills/prepare-post/scripts/check-post.mjs <slug>
npx markdownlint src/content/backlog/<slug>.md
npm run build
npm run backlog:check
```

The checker should show 0 errors, with any remaining warnings explained.
Backlog posts aren't rendered by the build. Run it anyway, because it catches
schema errors in front matter and series pages.

## Report back

Keep it short. List what changed (front matter, links, attribution, image
sizes and what the crop shows, series edits), any warnings Jason needs to
decide on, and when the post will publish. Don't commit or push unless he asks.
When he does, the post and its images
(`public/img/<slug>.jpg`, `public/img/optimized/<slug>.*`) go in one commit:
`post: schedule "<Title>"`, with the photo credit in the body.
