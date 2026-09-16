#!/bin/bash
# Renders the Consolidation Math print master to PDF.
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu \
  --print-to-pdf="consolidation-math.pdf" --no-pdf-header-footer \
  --virtual-time-budget=20000 \
  "file://$PWD/consolidation-math-master.html" 2>/dev/null
echo "consolidation-math.pdf rendered"
