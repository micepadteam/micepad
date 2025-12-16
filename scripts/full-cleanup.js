#!/usr/bin/env node
/**
 * Full HTML cleanup - removes WP/Elementor bloat and replaces CSS
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');

function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function cleanupFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalLength = content.length;

  // Skip landing pages (they're already clean)
  if (filePath.includes('event-app-for-')) {
    return { modified: false, savedKB: 0 };
  }

  // 1. Remove ALL WordPress/Elementor CSS link tags
  const cssPatterns = [
    /<link[^>]*href=['"][^'"]*wp-content\/plugins[^'"]*\.css[^'"]*['"][^>]*\/?>/gi,
    /<link[^>]*href=['"][^'"]*wp-content\/themes[^'"]*\.css[^'"]*['"][^>]*\/?>/gi,
    /<link[^>]*href=['"][^'"]*wp-includes[^'"]*\.css[^'"]*['"][^>]*\/?>/gi,
    /<link[^>]*href=['"][^'"]*uicore[^'"]*\.css[^'"]*['"][^>]*\/?>/gi,
  ];

  for (const pattern of cssPatterns) {
    content = content.replace(pattern, '');
  }

  // 2. Remove inline style blocks (keeping just a few critical ones)
  // Remove giant elementor inline styles
  content = content.replace(/<style[^>]*id=['"]elementor-frontend-inline-css['"][^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<style[^>]*id=['"][^'"]*-inline-css['"][^>]*>[\s\S]*?<\/style>/gi, '');

  // 3. Remove Elementor data attributes
  const dataAttrs = [
    /\s+data-id="[^"]*"/gi,
    /\s+data-element_type="[^"]*"/gi,
    /\s+data-settings='[^']*'/gi,
    /\s+data-settings="[^"]*"/gi,
    /\s+data-widget_type="[^"]*"/gi,
    /\s+data-core-v316-plus="[^"]*"/gi,
    /\s+data-elementor-type="[^"]*"/gi,
    /\s+data-elementor-id="[^"]*"/gi,
    /\s+data-elementor-device-mode="[^"]*"/gi,
    /\s+data-elementor-post-type="[^"]*"/gi,
  ];

  for (const pattern of dataAttrs) {
    content = content.replace(pattern, '');
  }

  // 4. Remove WP/Elementor script tags
  const scriptPatterns = [
    /<script[^>]*src=['"][^'"]*wp-content\/plugins[^'"]*\.js[^'"]*['"][^>]*><\/script>/gi,
    /<script[^>]*src=['"][^'"]*wp-includes[^'"]*\.js[^'"]*['"][^>]*><\/script>/gi,
    /<script[^>]*id=['"][^'"]*-js['"][^>]*>[\s\S]*?<\/script>/gi,
  ];

  for (const pattern of scriptPatterns) {
    content = content.replace(pattern, '');
  }

  // 5. Remove preload/prefetch for WP resources
  content = content.replace(/<link[^>]*rel=['"](?:preload|prefetch)['"][^>]*href=['"][^'"]*wp-[^'"]*['"][^>]*\/?>/gi, '');

  // 6. Add single CSS link if not already present
  if (!content.includes('/css/simple.css')) {
    content = content.replace(
      '</head>',
      '  <link rel="stylesheet" href="/css/simple.css">\n</head>'
    );
  }

  // 7. Clean up excessive whitespace
  content = content.replace(/\n{3,}/g, '\n\n');
  content = content.replace(/^\s+$/gm, '');

  const savedKB = ((originalLength - content.length) / 1024).toFixed(1);

  if (content.length !== originalLength) {
    fs.writeFileSync(filePath, content);
    return { modified: true, savedKB };
  }

  return { modified: false, savedKB: 0 };
}

// Main
console.log('Full HTML cleanup starting...\n');

const htmlFiles = getAllHtmlFiles(DIST_DIR);
let modifiedCount = 0;
let totalSavedKB = 0;

for (const file of htmlFiles) {
  const relativePath = path.relative(DIST_DIR, file);
  const result = cleanupFile(file);
  if (result.modified) {
    console.log(`✓ ${relativePath} (-${result.savedKB}KB)`);
    modifiedCount++;
    totalSavedKB += parseFloat(result.savedKB);
  }
}

console.log(`\nDone! Modified ${modifiedCount} of ${htmlFiles.length} HTML files.`);
console.log(`Total saved: ${totalSavedKB.toFixed(1)}KB (${(totalSavedKB / 1024).toFixed(2)}MB)`);
