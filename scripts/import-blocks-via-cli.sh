#!/bin/bash

# Import canonical blocks using Sanity CLI
# This uses your existing Sanity authentication

echo "=============================================="
echo "Canonical Blocks Import (CLI Method)"
echo "=============================================="
echo ""

# Read the markdown file and create blocks manually using sanity documents create
# This is a simplified approach - you'll need to create blocks manually or use Studio

echo "Note: Due to the complexity of parsing markdown to NDJSON,"
echo "the easiest approach is to create blocks directly in Sanity Studio."
echo ""
echo "To do this:"
echo "1. Run: cd sanity && npm run dev"
echo "2. Open Studio in browser"
echo "3. Click '+ Create' → 'Canonical Content Block'"
echo "4. Fill in the fields for each of the 16 blocks"
echo ""
echo "Block IDs to create:"
echo "  1. travel-to-islay"
echo "  2. distilleries-overview"
echo "  3. families-children"
echo "  4. ferry-support"
echo "  5. trust-signals"
echo "  6. bruichladdich-proximity"
echo "  7. portbahn-beach"
echo "  8. shorefield-character"
echo "  9. port-charlotte-village"
echo " 10. wildlife-geese"
echo " 11. food-drink-islay"
echo " 12. beaches-overview"
echo " 13. jura-day-trip"
echo " 14. jura-longer-stay"
echo " 15. bothan-jura-teaser"
echo " 16. about-us"
echo ""
echo "Reference: _claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md"
echo ""
