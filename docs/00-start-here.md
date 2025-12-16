# micepad.co local static migration (Phase A)

## Goal
Mirror micepad.co (including /hk and /tw) into static files locally, verify basic browsing, and produce a deploy-ready `dist/`.

## Scope
- No redesign
- No manual page rebuild
- Only fix breakage needed for static hosting later (forms, broken assets/links, WP runtime calls)

## Canonical URL behavior to preserve (observed)
- `/hk` -> `/hk/`
- `/tw` -> `/tw/`
- Most other pages: prefer NO trailing slash (`/products/foo`), and `/products/foo/` redirects to `/products/foo`

## Note
Local testing can remain online (external assets allowed).
