# Progress log

## 2025-12-14
- Initialized local-first migration structure and scripts.
- Completed wget mirroring for main site, /hk/, and /tw/ regions.
- Created dist/ folder with initial 5,291 files (484MB).
- Created sitemap-from-list.js script to generate sitemap.xml from URL list.
- Fixed assets: favicon, logo, select-arrow.svg paths.
- Deleted 283 WordPress `?p=` post ID files (39MB), reduced to 5,010 files (445MB).
- Converted 2 contact forms to Formspree (form ID: xzznwvlq):
  - dist/contact-us.html
  - dist/contact-us/index.html
- TODO: Convert remaining contact forms to Formspree:
  - dist/hk/contact-us.html
  - dist/tw/contact-us.html
- Fixed "Loved by Happy Customers" carousel on contact-us pages by copying working section from home page (replaced broken element IDs with working ones: 8a558dd, 3e0803f).
