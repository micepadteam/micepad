# HK Grey Screen Issue - Root Cause & Fix

## Problem
The HK page (`/hk/index.html`) was showing a grey/blank screen while the main page (`/index.html`) worked fine.

## Root Cause
**Path mismatch for CSS files.**

The broken HK file used **relative parent paths** (`../wp-content/...`) expecting CSS files to be in the root `/dist/` folder:
```html
<link href='../wp-content/plugins/bdthemes-element-pack/assets/css/bdt-uikit.css...' />
```

The working version uses **local paths** (`wp-content/...`) with CSS files inside the `/dist/hk/` folder:
```html
<link href='wp-content/plugins/bdthemes-element-pack/assets/css/bdt-uikit.css...' />
```

## Why This Matters
- HK is a regional subsite that was scraped separately from the main site
- The HK subsite has its own `wp-content/uploads/sites/4/` structure with site-specific CSS (e.g., `uicore-global.css?ver=7274.css`)
- When paths point to `../wp-content/`, the browser looks in the wrong location

## Fix Applied
Copied the working files from `fix/stepwise` branch:
```bash
git checkout fix/stepwise -- dist/hk/index.html
git checkout fix/stepwise -- dist/hk/wp-content/
```

This restored:
1. The correct `index.html` with local `wp-content/...` paths
2. The local `wp-content/` folder containing all required CSS, JS, fonts, and uploads

## Key Files
- `/dist/hk/index.html` - uses local paths
- `/dist/hk/wp-content/plugins/` - Elementor, bdthemes CSS/JS
- `/dist/hk/wp-content/uploads/sites/4/` - HK-specific CSS like `uicore-global.css`
