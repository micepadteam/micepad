#!/usr/bin/env node
/**
 * Cleanup WordPress/Elementor bloat from static HTML files
 * Removes: wp-json links, xmlrpc, shortlink, generator meta tags, oEmbed links,
 *          JS config objects, inline style blocks with WP/Elementor presets
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Simple regex patterns to remove
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
  // RSS feed links (not needed for static site)
  /<link[^>]*type=['"]application\/rss\+xml['"][^>]*\/?>/gi,
  // gmpg.org profile link
  /<link[^>]*rel=['"]profile['"][^>]*href="[^"]*gmpg\.org[^"]*"[^>]*\/?>/gi,
];

// Style block IDs to remove entirely
// NOTE: Keep 'elementor-frontend-inline-css' - it contains critical page styles
const STYLE_IDS_TO_REMOVE = [
  'classic-theme-styles-inline-css',
  'global-styles-inline-css',
  // 'elementor-frontend-inline-css', // KEEP - has critical styles (.elementor-kit-124)
];

// JS config variable names to remove
const JS_CONFIGS_TO_REMOVE = [
  'ElementPackConfig',
  'elementorFrontendConfig',
  'ElementorProFrontendConfig',
  'element_pack_ajax_login_config',
  'anwpPostGridElementorData',
];

// HTML comments containing these patterns should be removed
const COMMENT_PATTERNS_TO_REMOVE = [
  /<!--\s*Custom HTML - Page Options\s*-->\{[^}]*"type":"elementor"[^]*?\}-->/gi,
  /<!--\s*Custom HTML[^>]*-->.*?(?=<!--|$)/gs,
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
  const originalLength = content.length;

  // 1. Remove simple patterns (link/meta tags)
  for (const pattern of PATTERNS_TO_REMOVE) {
    const newContent = content.replace(pattern, '');
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  }

  // 1b. Remove HTML comments with embedded Elementor JSON data
  // Pattern: <!-- Custom HTML - Page Options -->{...JSON with "type":"elementor"...}
  const elementorCommentPattern = /<!--\s*Custom HTML[^>]*-->\s*\{[\s\S]*?"type"\s*:\s*"elementor"[\s\S]*?\}(?=\s*<|\s*$)/g;
  const newContentComments = content.replace(elementorCommentPattern, '');
  if (newContentComments !== content) {
    modified = true;
    content = newContentComments;
  }

  // 2. Remove style blocks by ID
  for (const styleId of STYLE_IDS_TO_REMOVE) {
    const styleRegex = new RegExp(
      `<style[^>]*id=['"]${styleId}['"][^>]*>[\\s\\S]*?<\\/style>`,
      'gi'
    );
    const newContent = content.replace(styleRegex, '');
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  }

  // 3. Remove JS config variables (var ConfigName = {...};)
  for (const configName of JS_CONFIGS_TO_REMOVE) {
    // Match: var ConfigName = { ... };
    // Use a function to find balanced braces
    const varPattern = new RegExp(`var\\s+${configName}\\s*=\\s*\\{`);
    let match;
    while ((match = content.match(varPattern))) {
      const startIdx = match.index;
      let braceCount = 0;
      let endIdx = startIdx;
      let inString = false;
      let stringChar = '';
      let escaped = false;

      // Find the opening brace
      while (endIdx < content.length && content[endIdx] !== '{') endIdx++;

      // Now find matching closing brace
      for (let i = endIdx; i < content.length; i++) {
        const char = content[i];

        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === '\\') {
          escaped = true;
          continue;
        }

        if (inString) {
          if (char === stringChar) inString = false;
          continue;
        }

        if (char === '"' || char === "'") {
          inString = true;
          stringChar = char;
          continue;
        }

        if (char === '{') braceCount++;
        if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i + 1;
            // Skip trailing semicolon if present
            if (content[endIdx] === ';') endIdx++;
            break;
          }
        }
      }

      if (braceCount === 0) {
        content = content.slice(0, startIdx) + content.slice(endIdx);
        modified = true;
      } else {
        // Couldn't find balanced braces, break to avoid infinite loop
        break;
      }
    }
  }

  // 4. Clean up empty script tags left behind
  content = content.replace(/<script[^>]*>\s*<\/script>/gi, '');

  // 5. Clean up empty lines created by removals
  content = content.replace(/^\s*[\r\n]/gm, '\n').replace(/\n{3,}/g, '\n\n');

  if (modified) {
    fs.writeFileSync(filePath, content);
    const savedKB = ((originalLength - content.length) / 1024).toFixed(1);
    return { modified: true, savedKB };
  }
  return { modified: false, savedKB: 0 };
}

// Main
console.log('Cleaning WordPress/Elementor bloat from HTML files...\n');

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
