#!/bin/bash
# Renders both Generational Wealth guide masters to PDF.
# Run from this directory after any copy/data edit — the masters
# re-paginate themselves at render time (see the paginator script
# at the end of each HTML file).
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for g in builders-guide stewards-guide; do
  "$CHROME" --headless=new --disable-gpu \
    --print-to-pdf="$g.pdf" --no-pdf-header-footer \
    --virtual-time-budget=20000 \
    "file://$PWD/$g-master.html" 2>/dev/null
  echo "$g.pdf rendered"
done
