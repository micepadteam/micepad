#!/bin/bash
cd /Users/nguyenvu/projects/micepad-static/dist/blog
for f in *.html; do
  if [ "$f" != "index.html" ]; then
    id=$(grep -oE 'id="post-[0-9]+"' "$f" 2>/dev/null | head -1 | sed 's/id="post-//' | sed 's/"//')
    if [ -n "$id" ]; then
      echo "$id:$f"
    fi
  fi
done | sort -t: -k1 -n
