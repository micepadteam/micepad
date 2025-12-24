# Micepad Static Blog

A Jekyll-powered blog for Micepad event management insights.

## Local development

```bash
# For dist folder (static HTML)
cd /Users/nguyenvu/projects/micepad-static/dist && python3 -m http.server 3000

# For Jekyll (docs folder)
gem install bundler jekyll
cd docs
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000` to preview the site.

---

## How to Change Content

### Add a New Blog Post

1. Create a new file in `docs/_posts/` with this naming format:
   ```
   YYYY-MM-DD-your-post-title.md
   ```
   Example: `2024-12-24-holiday-event-tips.md`

2. Add front matter at the top:
   ```yaml
   ---
   layout: post
   title: "Your Post Title Here"
   date: 2024-12-24
   ---
   ```

3. Write your content in Markdown below the front matter:
   ```markdown
   ---
   layout: post
   title: "Holiday Event Tips"
   date: 2024-12-24
   ---

   Your content goes here...

   ## Subheading

   More content with **bold** and *italic* text.

   ![Image description](/path/to/image.jpg)
   ```

### Edit an Existing Post

1. Find the post in `docs/_posts/`
2. Open and edit the `.md` file
3. Save - Jekyll will rebuild automatically if server is running

### Add Images

1. Upload images to `docs/uploads/` (organized by year/month)
2. Reference in posts:
   ```markdown
   ![Alt text](/micepad-static/docs/uploads/2024/12/my-image.jpg)
   ```

---

## Project Structure

```
docs/
├── _config.yml          # Site settings (title, URL, etc.)
├── _layouts/            # Page templates
│   ├── default.html     # Base template
│   ├── post.html        # Blog post template
│   ├── cards.html       # Card-style layout
│   └── ...
├── _posts/              # Blog posts (Markdown files)
│   └── 2024-01-01-example.md
├── _site/               # Generated output (don't edit!)
├── uploads/             # Images and media
└── index.md             # Homepage
```

---

## Common Tasks

### Change Site Title/Description

Edit `docs/_config.yml`:
```yaml
title: Micepad Blog
description: Your new description here
```

### Change Homepage Layout

Edit `docs/index.md` - modify the Liquid template loop or switch layouts.

### Add a New Page

Create a new `.md` or `.html` file in `docs/`:
```markdown
---
layout: default
title: About Us
---

# About Us

Content here...
```

---

## Deployment

The site is deployed to GitHub Pages automatically when you push to the `gh-pages` branch.
