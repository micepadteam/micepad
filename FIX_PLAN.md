# Micepad Static Site Fix Plan

## Root Cause Analysis

Per `docs/gray_screen.md`, the gray screen issue is caused by **missing CSS links** in the HTML files. Working pages (like `hk/index.html`) have ~21 wp-content CSS links, while broken pages have 0-2.

### CSS Link Counts:
| File | CSS Links | Status |
|------|-----------|--------|
| `hk/index.html` | 21 | Working |
| `hk/customers.html` | 0 | Broken |
| `tw/about-us.html` | 0 | Broken |
| `tw/contact-us.html` | 2 | Broken |
| `tw/customers.html` | 0 | Broken |
| `solutions.html` | 0 | Broken |
| `hk/solutions.html` | 0 | Broken |
| `tw/solutions.html` | 0 | Broken |
| `hk/products.html` | 0 | Broken |
| `tw/products.html` | 0 | Broken |

### Fix Branch Status:
Only `hk/customers.html` has a working version in `fix/stepwise` branch (9 CSS links). Other files in that branch have the same issue.

---

## Critical Issues (Pages Completely Broken)

### 1. Solutions Pages - Missing CSS
**Affected files:**
- `dist/solutions.html`
- `dist/hk/solutions.html`
- `dist/tw/solutions.html`

**Problem:** Missing wp-content CSS links. Pages render as raw unstyled HTML.

**Fix:** Need to add CSS links from a working template (e.g., copy from `hk/index.html` or main `solutions.html` if it exists with proper CSS).

---

### 2. Products Pages (HK/TW) - Missing CSS
**Affected files:**
- `dist/hk/products.html`
- `dist/tw/products.html`

**Problem:** Missing wp-content CSS links. Pages show unstyled content.

**Fix:** Copy CSS links from working `products.html` (main site version).

---

### 3. Blank/Gray Screen Pages - Missing CSS
**Affected files:**
- `dist/hk/customers.html` - Can restore from `fix/stepwise` branch
- `dist/tw/about-us.html`
- `dist/tw/contact-us.html`
- `dist/tw/customers.html`

**Problem:** Missing wp-content CSS links causes gray screen.

**Fix:**
- `hk/customers.html`: `git checkout fix/stepwise -- dist/hk/customers.html`
- Others: Copy CSS links from working TW index.html

---

## Minor Issues

### 4. Pricing Page - Giant Checkmark Icons
**Affected file:**
- `dist/pricing.html`

**Problem:** Checkmark icons displaying as oversized blue checkmarks.

---

### 5. Home Page - Missing Images
**Affected file:**
- `dist/home.html`

**Problem:** Some sections show empty gray boxes where images should be.

---

## Fix Strategy

1. **Quick fix for `hk/customers.html`:**
   ```bash
   git checkout fix/stepwise -- dist/hk/customers.html
   ```

2. **For other broken pages:** Extract CSS `<link>` tags from working regional pages and add to broken pages:
   - HK pages → use CSS from `hk/index.html`
   - TW pages → use CSS from `tw/index.html`
   - Main solutions → use CSS from `index.html`

3. **Verify wp-content folders exist** in each region directory with required CSS files.

---

## Working Pages (No Action Needed)
- about-us, blog, contact-us, customers, index, products, sitemap
- privacy-policy, terms-conditions
- hk-index, hk-about-us, hk-contact-us, hk-blog
- tw-index, tw-blog
