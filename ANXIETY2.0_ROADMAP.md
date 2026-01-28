# Anxiety 2.0 - Feature Roadmap

## Vision

Three features that make Technical Anxiety truly unique and authentic:

1. **Content as Infrastructure** - Topology as homepage
2. **Anxiety as a Feature** - Cognitive state modes
3. **Exposing the Machine** - Transparent infrastructure

---

## Feature 1: Exposing the Machine

**Concept:** Make the infrastructure visible. Show the backlog, changelog, deployment status. Transparency as design.

### What Gets Added

**New Navigation Items:**
- `/changelog` - What changed, when, why
- `/backlog` - What's queued for publication (read-only view)
- `/system` - GitHub Actions status, build info, deployment history

**Backlog Page (`/backlog`):**
- Shows all posts in `src/content/backlog/`
- Displays scheduled publication dates
- Shows series information
- Read-only - not an admin interface
- Lets readers see what's coming

**Changelog Page (`/changelog`):**
- Auto-generates from git commits
- Groups by date
- Shows meaningful changes (not every typo fix)
- Links to relevant posts/features when applicable

**System Page (`/system`):**
- Last deployment time
- Build duration
- GitHub Actions workflow status
- Maybe: content stats (total posts, series count, etc.)

### Implementation Notes

- Backlog: Read from content collection, filter by future dates
- Changelog: Parse git log, format as markdown
- System: GitHub API for workflow status (or static at build time)
- All pages use existing Astro layouts

### Why This First

- Easiest to implement
- Ships fast
- Proves the "transparency" concept
- No complex state management
- Builds on existing content structure

---

## Feature 2: Anxiety as a Feature (Cognitive State Modes)

**Concept:** Different modes for different cognitive states. The site adapts to how you're thinking.

### The Three Modes

**Deep Focus Mode:**
- Monospace font, high contrast
- Hide sidebar, navigation collapses to minimal
- Article content only, no distractions
- Keyboard shortcuts (n/p for next/prev, esc to exit)
- Perfect for when you need to concentrate

**Exploration Mode (Default):**
- Current experience
- Series navigation visible
- Related posts shown
- Full sidebar with all connections
- Topology visualization available

**Crisis Mode:**
- Surfaces Mental Health cluster only
- Direct links to practical resources
- Simplified navigation
- Calming color palette
- Maybe: "Need to talk to someone?" with crisis resources
- For when you're struggling and need help fast

### Implementation

**Mode Switcher:**
- Three icons in header (focus/explore/crisis)
- Stores preference in localStorage
- Persists across sessions
- Keyboard shortcut to cycle modes (Ctrl+M or similar)

**Technical Approach:**
- CSS classes toggle layouts (`data-mode="focus"` on body)
- JavaScript handles mode switching
- No page reload required
- Minimal performance impact

**Per-Mode Styling:**
```css
[data-mode="focus"] {
  /* Monospace, minimal chrome */
}

[data-mode="explore"] {
  /* Current styling */
}

[data-mode="crisis"] {
  /* Calming, simplified */
}
```

### Why This Second

- Medium complexity
- High impact on user experience
- Differentiates from every other tech blog
- Authentic to the "anxiety" brand
- Requires the base site to be solid first

---

## Feature 3: Content as Infrastructure (Homepage Topology)

**Concept:** Replace the traditional homepage with the topology visualization. Make it the entry point.

### The Change

**Current State:**
- Homepage: Traditional blog list
- Topology: Separate `/topology` page

**New State:**
- Homepage (`/`): Topology visualization
- Archive (`/archive`): Traditional blog list
- Quick toggle: "Prefer traditional view?" link

### Why This Is Bold

- Most blogs lead with latest posts
- This leads with architecture of thought
- Requires confidence in the visualization
- Makes a statement about how you think

### Implementation

**File Changes:**
- Move `src/pages/topology.astro` → `src/pages/index.astro`
- Move current `src/pages/index.astro` → `src/pages/archive.astro`
- Update navigation links
- Add "traditional view" toggle

**Fallback:**
- Keep `/archive` prominent in nav
- Add explanation on first visit
- Maybe: localStorage preference for default view

### Why This Last

- Biggest change to user experience
- Needs the topology to be proven and polished
- Requires validation that people actually use it
- Should only do this if topology becomes the primary way you think about your content

---

## Recommended Implementation Order

### Phase 1: Exposing the Machine (Week 1)
- Build `/backlog`, `/changelog`, `/system` pages
- Add to main navigation
- Ship to production
- Validate the transparency concept

### Phase 2: Cognitive State Modes (Week 2-3)
- Implement mode switcher
- Build CSS for each mode
- Add keyboard shortcuts
- Test across devices
- Ship to production

### Phase 3: Content as Infrastructure (Week 4+)
- Only if topology proves valuable
- Only if you're using it regularly
- Only if it feels like the right entry point
- Move topology to homepage
- Create archive page
- Ship to production

---

## Success Criteria

**Exposing the Machine:**
- Backlog page shows scheduled posts accurately
- Changelog is readable and useful
- System page provides actual value (not just vanity metrics)

**Cognitive State Modes:**
- You actually use different modes yourself
- Focus mode is genuinely distraction-free
- Crisis mode feels helpful, not performative

**Content as Infrastructure:**
- Topology becomes your primary navigation method
- New visitors understand it without explanation
- It accurately represents how you think about your content

---

## Notes

- These are feature releases, not quick adds
- Each deserves focused attention
- Ship one, validate, then move to next
- Don't build Feature 3 until Features 1 & 2 prove the concept
- It's okay to decide not to do all three

---

**Current Status:** Topology visualization complete and committed to `anxiety2.0` branch. Ready for testing and validation before moving to any of these three features.

**Next Step:** Test the topology for a day. See if it's actually useful. Then decide which feature to build first.
