#!/bin/bash

# Image optimization script for Jekyll blog
# Resizes images to web-friendly dimensions and reduces quality slightly

MAX_WIDTH=1920
QUALITY=85

echo "Starting image optimization..."
echo "Max width: ${MAX_WIDTH}px, Quality: ${QUALITY}%"
echo ""

# Create backup directory
mkdir -p img/originals

# Counter for stats
total_before=0
total_after=0
count=0

# Process all JPG and PNG files
for img in img/*.jpg img/*.jpeg img/*.png; do
    # Skip if file doesn't exist (in case no files match pattern)
    [ -e "$img" ] || continue
    
    # Skip if already in originals directory
    [[ "$img" == *"originals"* ]] && continue
    
    # Get original file size
    size_before=$(stat -f%z "$img")
    total_before=$((total_before + size_before))
    
    # Get image dimensions
    width=$(sips -g pixelWidth "$img" | tail -n1 | awk '{print $2}')
    
    # Only process if image is larger than MAX_WIDTH
    if [ "$width" -gt "$MAX_WIDTH" ]; then
        echo "Processing: $(basename "$img")"
        echo "  Original: ${width}px wide, $(numfmt --to=iec-i --suffix=B $size_before)"
        
        # Backup original
        cp "$img" "img/originals/$(basename "$img")"
        
        # Resize and compress
        sips --resampleWidth $MAX_WIDTH --setProperty formatOptions $QUALITY "$img" > /dev/null 2>&1
        
        # Get new file size
        size_after=$(stat -f%z "$img")
        total_after=$((total_after + size_after))
        savings=$((size_before - size_after))
        percent=$((100 - (size_after * 100 / size_before)))
        
        echo "  Optimized: ${MAX_WIDTH}px wide, $(numfmt --to=iec-i --suffix=B $size_after)"
        echo "  Saved: $(numfmt --to=iec-i --suffix=B $savings) (${percent}% reduction)"
        echo ""
        
        count=$((count + 1))
    else
        # Still compress even if size is OK
        echo "Compressing: $(basename "$img") (already good size: ${width}px)"
        
        # Backup original
        cp "$img" "img/originals/$(basename "$img")"
        
        # Just compress without resizing
        sips --setProperty formatOptions $QUALITY "$img" > /dev/null 2>&1
        
        size_after=$(stat -f%z "$img")
        total_after=$((total_after + size_after))
        savings=$((size_before - size_after))
        
        if [ $savings -gt 0 ]; then
            percent=$((100 - (size_after * 100 / size_before)))
            echo "  Saved: $(numfmt --to=iec-i --suffix=B $savings) (${percent}% reduction)"
        else
            echo "  No compression needed"
        fi
        echo ""
        
        count=$((count + 1))
    fi
done

# Summary
echo "================================"
echo "Optimization Complete!"
echo "================================"
echo "Images processed: $count"
echo "Total before: $(numfmt --to=iec-i --suffix=B $total_before)"
echo "Total after: $(numfmt --to=iec-i --suffix=B $total_after)"
total_savings=$((total_before - total_after))
total_percent=$((100 - (total_after * 100 / total_before)))
echo "Total saved: $(numfmt --to=iec-i --suffix=B $total_savings) (${total_percent}% reduction)"
echo ""
echo "Original images backed up to: img/originals/"
