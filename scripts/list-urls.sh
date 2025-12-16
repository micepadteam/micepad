#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="${1:-dist}"
cd "$DIST_DIR"

find . -type f -name "*.html" | sort | awk '
{
  p=$0
  sub(/^\.\//,"/",p)

  if (p=="/index.html") { print "/"; next }
  if (p ~ /\/index\.html$/) { sub(/index\.html$/,"",p); print p; next }

  sub(/\.html$/,"",p)
  print p
}' | sort -u
