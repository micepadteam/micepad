import fs from "node:fs";
import path from "node:path";

const DIST = process.argv[2] || "dist";
const BASE = process.argv[3] || "https://micepad.co";

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(DIST).filter(f => f.endsWith(".html"));
const urls = new Set();

for (const f of files) {
  let rel = path.relative(DIST, f).replaceAll(path.sep, "/");
  if (rel === "index.html") { urls.add(`${BASE}/`); continue; }

  if (rel.endsWith("/index.html")) {
    rel = rel.replace(/index\.html$/, "");
    urls.add(`${BASE}/${rel}`);
    continue;
  }

  rel = rel.replace(/\.html$/, "");
  urls.add(`${BASE}/${rel}`);
}

const sorted = [...urls].sort();
const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sorted.map(u => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml, "utf8");
console.log(`Wrote ${sorted.length} URLs to ${DIST}/sitemap.xml`);
