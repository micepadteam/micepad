#!/usr/bin/env node
/**
 * Cleanup WordPress meta tags from static HTML files
 * Removes: wp-json links, xmlrpc, shortlink, generator meta tags, oEmbed links
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Patterns to remove (entire lines or inline elements)
const PATTERNS_TO_REMOVE = [
  // wp-json API links
  /<link[^>]*href="[^"]*wp-json[^"]*"[^>]*\/?>/gi,
  // xmlrpc links
  /<link[^>]*href="[^"]*xmlrpc\.php[^"]*"[^>]*\/?>/gi,
  // shortlink (but keep canonical)
  /<link[^>]*rel=['"]shortlink['"][^>]*\/?>/gi,
  // WordPress generator
  /<meta[^>]*name=['"]generator['"][^>]*content=['"][^"]*WordPress[^"]*['"][^>]*\/?>/gi,
  // Elementor generator
  /<meta[^>]*name=['"]generator['"][^>]*content=['"][^"]*Elementor[^"]*['"][^>]*>/gi,
  // oEmbed links (JSON and XML)
  /<link[^>]*type=['"]application\/json\+oembed['"][^>]*\/?>/gi,
  /<link[^>]*type=['"]text\/xml\+oembed['"][^>]*\/?>/gi,
  // api.w.org link
  /<link[^>]*rel=['"]https:\/\/api\.w\.org\/['"][^>]*\/?>/gi,
  // RSD/EditURI links
  /<link[^>]*rel=['"]EditURI['"][^>]*\/?>/gi,
];

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
  let modified = false;

  for (const pattern of PATTERNS_TO_REMOVE) {
    const newContent = content.replace(pattern, '');
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  }

  // Clean up empty lines created by removals
  content = content.replace(/^\s*[\r\n]/gm, '\n').replace(/\n{3,}/g, '\n\n');

  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

// Main
console.log('Cleaning WordPress meta tags from HTML files...\n');

const htmlFiles = getAllHtmlFiles(DIST_DIR);
let modifiedCount = 0;

for (const file of htmlFiles) {
  const relativePath = path.relative(DIST_DIR, file);
  if (cleanupFile(file)) {
    console.log(`✓ ${relativePath}`);
    modifiedCount++;
  }
}

console.log(`\nDone! Modified ${modifiedCount} of ${htmlFiles.length} HTML files.`);
