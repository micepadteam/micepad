#!/usr/bin/env node
/**
 * Build pSEO landing pages from templates and data
 * Usage: node scripts/build-landings.js
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const DATA_DIR = path.join(__dirname, '../data');
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Simple template engine (Mustache-like)
function render(template, data) {
  return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
    const keys = key.trim().split('.');
    let value = data;
    for (const k of keys) {
      value = value?.[k];
    }
    return value ?? '';
  });
}

// Load JSON file
function loadJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch (e) {
    console.error(`Error loading ${filepath}:`, e.message);
    return null;
  }
}

// Generate landing page HTML
function generateLandingHTML(landing, site) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${landing.seo.title}</title>
  <meta name="description" content="${landing.seo.description}">
  <meta name="keywords" content="${landing.seo.keywords.join(', ')}">
  <link rel="canonical" href="${site.url}/${landing.slug}/">
  <link rel="icon" href="/uploads/2023/07/cropped-micepad-favicon.png">
  <link rel="stylesheet" href="/css/styles.css">
  <style>
    .landing-hero { padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
    .landing-hero h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #070707; }
    .landing-hero p { font-size: 1.25rem; color: #6E7A84; max-width: 600px; margin: 0 auto 2rem; }
    .btn-primary { display: inline-block; padding: 16px 32px; background: #155EEF; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .btn-primary:hover { background: #0d4fc7; }
    .benefits { padding: 60px 20px; max-width: 1200px; margin: 0 auto; }
    .benefits h2 { text-align: center; margin-bottom: 40px; }
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .benefit-card { padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .benefit-card h3 { margin-bottom: 10px; color: #070707; }
    .benefit-card p { color: #6E7A84; }
    .faq { padding: 60px 20px; background: #f8f9fa; }
    .faq h2 { text-align: center; margin-bottom: 40px; }
    .faq-list { max-width: 800px; margin: 0 auto; }
    .faq-item { margin-bottom: 20px; padding: 20px; background: white; border-radius: 8px; }
    .faq-item h4 { margin-bottom: 10px; color: #070707; }
    .faq-item p { color: #6E7A84; margin: 0; }
    .cta-section { padding: 80px 20px; text-align: center; background: #155EEF; color: white; }
    .cta-section h2 { margin-bottom: 1rem; }
    .cta-section p { margin-bottom: 2rem; opacity: 0.9; }
    .cta-section .btn-primary { background: white; color: #155EEF; }
  </style>
</head>
<body>
  <header style="padding: 20px; border-bottom: 1px solid #eee;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <a href="/"><img src="/uploads/2021/05/Micepad-logo@2x.png" alt="Micepad" height="40"></a>
      <nav>
        <a href="/products/" style="margin-right: 20px; color: #333;">Products</a>
        <a href="/solutions/" style="margin-right: 20px; color: #333;">Solutions</a>
        <a href="/contact-us/" class="btn-primary" style="padding: 10px 20px; font-size: 14px;">Get Started</a>
      </nav>
    </div>
  </header>

  <section class="landing-hero">
    <h1>${landing.hero.headline}</h1>
    <p>${landing.hero.subheadline}</p>
    <a href="${landing.hero.cta.url}" class="btn-primary">${landing.hero.cta.label}</a>
  </section>

  <section class="benefits">
    <h2>Why Choose Micepad?</h2>
    <div class="benefits-grid">
      ${landing.benefits.map(b => `
      <div class="benefit-card">
        <h3>${b.title}</h3>
        <p>${b.description}</p>
      </div>`).join('')}
    </div>
  </section>

  ${landing.faq && landing.faq.length > 0 ? `
  <section class="faq">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      ${landing.faq.map(f => `
      <div class="faq-item">
        <h4>${f.question}</h4>
        <p>${f.answer}</p>
      </div>`).join('')}
    </div>
  </section>` : ''}

  <section class="cta-section">
    <h2>Ready to Transform Your Events?</h2>
    <p>Join thousands of event organizers who trust Micepad</p>
    <a href="/contact-us/" class="btn-primary">Get a Free Demo</a>
  </section>

  <footer style="padding: 40px 20px; background: #070707; color: #999; text-align: center;">
    <p>&copy; ${new Date().getFullYear()} Micepad. All rights reserved.</p>
  </footer>
</body>
</html>`;

  return html;
}

// Main build function
function build() {
  console.log('Building pSEO landing pages...\n');

  // Load site config
  const site = loadJSON(path.join(DATA_DIR, 'site.json'));
  if (!site) {
    console.error('Failed to load site.json');
    process.exit(1);
  }

  // Landing pages go directly to dist/event-app-for-{slug}/

  // Load and process each landing page data file
  const landingsDataDir = path.join(DATA_DIR, 'landings');
  const files = fs.readdirSync(landingsDataDir).filter(f =>
    f.endsWith('.json') && !f.startsWith('_')
  );

  let count = 0;
  for (const file of files) {
    const landing = loadJSON(path.join(landingsDataDir, file));
    if (!landing || !landing.slug) continue;

    // Generate HTML
    const html = generateLandingHTML(landing, site);

    // Write to file
    const outputDir = path.join(DIST_DIR, landing.slug);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'index.html'), html);

    console.log(`  ✓ /${landing.slug}/`);
    count++;
  }

  console.log(`\nBuilt ${count} landing pages.`);
}

build();
