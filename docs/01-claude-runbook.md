# Claude Code Runbook (Local-first)

## Phase A: Initial Mirror (DONE)

### Step 1 — Verify prerequisites
- wget, python3, rg (ripgrep), node

### Step 2 — Mirror site into snapshot/
Entry crawls: `/`, `/hk/`, `/tw/`. Exclude wp-admin, wp-json.

### Step 3 — Copy snapshot -> dist
Use rsync --delete.

### Step 4 — Local preview
python http.server, smoke test key pages.

### Step 5 — Scan for WP runtime dependencies
Search: wp-json, wp-admin, admin-ajax.php. Log findings.

### Step 6 — Inventory forms
Search: elementor-form, `<form`. Log locations.

### Step 7 — Generate URL list
`scripts/list-urls.sh` -> `docs/02-url-list.txt`

### Step 8 — Generate sitemap.xml
`scripts/sitemap-from-list.js` -> `dist/sitemap.xml`

---

## Phase B: Cleanup (CURRENT)

### Step 9 — Delete WordPress thumbnail variations
```bash
find dist/wp-content/uploads -type f \( -name "*-150x150*" -o -name "*-300x*" -o -name "*-768x*" -o -name "*-1024x*" -o -name "*-scaled*" \) -delete
```
Saves ~62MB.

### Step 10 — Reorganize images
Target structure:
```
dist/img/
  logo/           # Brand assets
  testimonials/   # Customer photos
  blog/           # Blog images
  products/       # Screenshots
  icons/          # UI icons
  hero/           # Banners
```

Run `scripts/migrate-images.js`:
1. Scan HTML for image refs
2. Build old→new path mapping
3. Copy with descriptive names
4. Update all HTML refs
5. Delete `wp-content/uploads/`

### Step 11 — Consolidate CSS
1. Extract critical CSS (inline, <15KB)
2. PurgeCSS unused styles
3. Bundle into single `/css/styles.css`
4. Update all HTML to use single link

### Step 12 — Simplify HTML
Remove Elementor bloat:
- `data-id`, `data-element_type`, `data-settings`, `data-widget_type`
- Excessive wrapper divs
- Redundant classes

---

## Phase C: pSEO Setup

### Step 13 — Create templates
```
templates/
  base.html       # Shared header/footer
  page.html       # Standard page
  blog-post.html  # Article
  blog-list.html  # Listing
  landing.html    # pSEO template
```

### Step 14 — Define data schema
```
data/
  site.json       # Global config
  landings/       # pSEO variations
```

### Step 15 — Build system
- SSG or custom Node build
- `npm run build` generates pages
- URL pattern: `/event-app-for-{industry}/`

---

## Target Structure
```
dist/
  index.html
  about-us.html
  contact-us.html
  pricing.html
  blog/
  products/
  solutions/
  customers/
  hk/
  tw/
  css/styles.css
  js/main.js
  img/{category}/
  sitemap.xml
  robots.txt
```

---

## Progress
Track in `docs/05-progress-log.md`
