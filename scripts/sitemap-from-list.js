import fs from "node:fs";

const inFile = process.argv[2];        // e.g. tmp/all-urls.txt
const outFile = process.argv[3];       // e.g. dist/sitemap.xml

const urls = fs.readFileSync(inFile, "utf8")
  .split(/\r?\n/)
  .map(s => s.trim())
  .filter(Boolean);

const unique = [...new Set(urls)].sort();

const xml =
`<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
unique.map(u => `  <url><loc>${u}</loc></url>`).join("\n") +
`\n</urlset>\n`;

fs.writeFileSync(outFile, xml, "utf8");
console.log(`Wrote ${unique.length} URLs to ${outFile}`);
