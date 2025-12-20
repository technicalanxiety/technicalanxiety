#!/bin/bash

# Archive Jekyll Files Script
# This script moves Jekyll-specific files to an archive directory
# to clean up the repository after successful Astro migration

set -e

ARCHIVE_DIR="jekyll-archive"
TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
LOG_FILE="jekyll-archive-${TIMESTAMP}.log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Jekyll Files Archive Script${NC}"
echo "==============================="
echo "This script will archive Jekyll-specific files after successful Astro migration."
echo "Archive directory: $ARCHIVE_DIR"
echo "Log file: $LOG_FILE"
echo ""

# Create archive directory
if [ ! -d "$ARCHIVE_DIR" ]; then
    echo -e "${YELLOW}Creating archive directory...${NC}"
    mkdir -p "$ARCHIVE_DIR"
    echo "Created $ARCHIVE_DIR directory" | tee -a "$LOG_FILE"
fi

# Function to archive file or directory
archive_item() {
    local item="$1"
    local description="$2"
    
    if [ -e "$item" ]; then
        echo -e "${YELLOW}Archiving: $item${NC} ($description)"
        mv "$item" "$ARCHIVE_DIR/"
        echo "Archived: $item -> $ARCHIVE_DIR/" | tee -a "$LOG_FILE"
        return 0
    else
        echo "Not found: $item (skipping)"
        echo "Not found: $item" | tee -a "$LOG_FILE"
        return 1
    fi
}

echo "Starting Jekyll file archival..."
echo "================================"

# Archive Jekyll configuration files
echo -e "\n${BLUE}Jekyll Configuration Files:${NC}"
archive_item "_config.yml" "Jekyll site configuration"
archive_item "_config_dev.yml" "Jekyll development configuration"
archive_item "Gemfile" "Ruby gem dependencies"
archive_item "Gemfile.lock" "Ruby gem lock file"

# Archive Jekyll directories
echo -e "\n${BLUE}Jekyll Directories:${NC}"
archive_item "_includes" "Jekyll include templates"
archive_item "_layouts" "Jekyll page layouts"
archive_item "_sass" "Jekyll SCSS stylesheets"
archive_item "_site" "Jekyll build output"
archive_item "_posts" "Jekyll blog posts (if not already migrated)"
archive_item "_pages" "Jekyll static pages"
archive_item "_data" "Jekyll data files"
archive_item "_plugins" "Jekyll plugins"

# Archive Jekyll-specific assets
echo -e "\n${BLUE}Jekyll Assets:${NC}"
archive_item "css" "Jekyll CSS directory"
archive_item "js" "Jekyll JavaScript directory"
archive_item "assets" "Jekyll assets directory"

# Archive other Jekyll-related files
echo -e "\n${BLUE}Other Jekyll Files:${NC}"
archive_item ".jekyll-cache" "Jekyll build cache"
archive_item "404.html" "Jekyll 404 page (if exists)"
archive_item "feed.xml" "Jekyll RSS feed template"
archive_item "sitemap.xml" "Jekyll sitemap template"
archive_item "robots.txt" "Jekyll robots.txt (if custom)"

# Archive GitHub Pages specific files (if not needed for Astro)
echo -e "\n${BLUE}GitHub Pages Files:${NC}"
archive_item "CNAME" "Custom domain configuration (check if still needed)"
archive_item ".nojekyll" "GitHub Pages Jekyll bypass file"

# Create archive summary
echo -e "\n${BLUE}Creating Archive Summary:${NC}"
cat > "$ARCHIVE_DIR/README.md" << EOF
# Jekyll Archive

This directory contains files from the original Jekyll implementation of the Technical Anxiety blog.

## Archive Information

- **Archive Date**: $(date)
- **Migration Completion**: Astro migration completed successfully
- **Original Jekyll Version**: $(grep 'jekyll' Gemfile 2>/dev/null | head -1 || echo "Unknown")

## Archived Contents

This archive contains the following Jekyll-specific files and directories:

$(ls -la "$ARCHIVE_DIR" | grep -v "^total" | grep -v "README.md" | awk '{print "- " $9 " (" $1 ")"}' | grep -v "^- $")

## Restoration Instructions

If you need to restore the Jekyll site for any reason:

1. Copy files back to the root directory:
   \`\`\`bash
   cp -r jekyll-archive/* .
   \`\`\`

2. Install Jekyll dependencies:
   \`\`\`bash
   bundle install
   \`\`\`

3. Build and serve:
   \`\`\`bash
   bundle exec jekyll serve
   \`\`\`

## Migration Notes

- All blog posts were successfully migrated to Astro format
- URL structure was preserved to maintain SEO and external links
- All features (search, comments, themes) were reimplemented in Astro
- Performance improvements achieved with Astro build system

## Safe to Delete

After confirming the Astro site is working correctly for 30+ days, this archive directory can be safely deleted.

## Contact

For questions about this archive or the migration process, contact the site maintainer.
EOF

echo -e "${GREEN}Archive summary created: $ARCHIVE_DIR/README.md${NC}"

# Create restoration script
cat > "$ARCHIVE_DIR/restore-jekyll.sh" << 'EOF'
#!/bin/bash

# Jekyll Restoration Script
# Use this script to restore Jekyll files if needed

echo "WARNING: This will restore Jekyll files and may overwrite Astro files!"
echo "Make sure you have backed up your current Astro implementation."
echo ""
read -p "Are you sure you want to restore Jekyll files? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
    echo "Restoring Jekyll files..."
    
    # Copy files back (excluding this script and README)
    for item in *; do
        if [ "$item" != "restore-jekyll.sh" ] && [ "$item" != "README.md" ]; then
            echo "Restoring: $item"
            cp -r "$item" ../
        fi
    done
    
    echo "Jekyll files restored. You may need to:"
    echo "1. Run 'bundle install' to install dependencies"
    echo "2. Run 'bundle exec jekyll serve' to start the site"
    echo "3. Update any configuration as needed"
else
    echo "Restoration cancelled."
fi
EOF

chmod +x "$ARCHIVE_DIR/restore-jekyll.sh"
echo -e "${GREEN}Restoration script created: $ARCHIVE_DIR/restore-jekyll.sh${NC}"

# Final summary
echo ""
echo "==============================="
echo -e "${GREEN}Jekyll Archive Complete!${NC}"
echo "==============================="
echo "Archived files are now in: $ARCHIVE_DIR/"
echo "Log file created: $LOG_FILE"
echo ""
echo "Next steps:"
echo "1. Verify Astro site is working correctly"
echo "2. Monitor for 30+ days to ensure stability"
echo "3. After confirmation, the archive can be safely deleted"
echo ""
echo -e "${YELLOW}Note: Keep the archive until you're confident the migration is successful!${NC}"