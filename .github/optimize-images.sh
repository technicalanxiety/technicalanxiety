#!/bin/bash

# Image optimization script for Jekyll blog
# Works on both macOS and Linux
# Only processes unoptimized images (no backup needed for Unsplash images)

# Configuration
MAX_WIDTH=1200
MAX_HEIGHT=630
QUALITY=85
TARGET_SIZE_KB=200

echo "Starting image optimization..."
echo "Target: ${MAX_WIDTH}x${MAX_HEIGHT}px, Quality: ${QUALITY}%, Max size: ${TARGET_SIZE_KB}KB"
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
    echo "Detected: macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    echo "Detected: Linux"
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

# Check for required tools
if [ "$OS" == "mac" ]; then
    if ! command -v sips &> /dev/null; then
        echo "Error: sips not found (should be built into macOS)"
        exit 1
    fi
elif [ "$OS" == "linux" ]; then
    if ! command -v convert &> /dev/null; then
        echo "Error: ImageMagick not found. Install with: sudo apt install imagemagick"
        exit 1
    fi
fi

echo ""

# Function to get file size in bytes
get_file_size() {
    if [ "$OS" == "mac" ]; then
        stat -f%z "$1"
    else
        stat -c%s "$1"
    fi
}

# Function to get image dimensions
get_image_width() {
    if [ "$OS" == "mac" ]; then
        sips -g pixelWidth "$1" | tail -n1 | awk '{print $2}'
    else
        identify -format "%w" "$1"
    fi
}

# Function to check if image needs optimization
needs_optimization() {
    local img="$1"
    local size=$(get_file_size "$img")
    local width=$(get_image_width "$img")
    local size_kb=$((size / 1024))
    
    # Check if image is too large (file size or dimensions)
    if [ "$size_kb" -gt "$TARGET_SIZE_KB" ] || [ "$width" -gt "$MAX_WIDTH" ]; then
        return 0  # true, needs optimization
    else
        return 1  # false, already optimized
    fi
}

# Function to optimize image
optimize_image() {
    local img="$1"
    
    if [ "$OS" == "mac" ]; then
        # macOS: Use sips
        sips --resampleWidth $MAX_WIDTH \
             --resampleHeight $MAX_HEIGHT \
             --setProperty formatOptions $QUALITY \
             "$img" > /dev/null 2>&1
    else
        # Linux: Use ImageMagick
        convert "$img" \
                -resize "${MAX_WIDTH}x${MAX_HEIGHT}^" \
                -gravity center \
                -extent "${MAX_WIDTH}x${MAX_HEIGHT}" \
                -quality $QUALITY \
                "$img"
    fi
}

# Function to format bytes for display
format_bytes() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes}B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$((bytes / 1024))KB"
    else
        echo "$((bytes / 1048576))MB"
    fi
}

# Counter for stats
total_before=0
total_after=0
count=0
skipped=0

# Process all JPG and PNG files
for img in img/*.jpg img/*.jpeg img/*.png; do
    # Skip if file doesn't exist
    [ -e "$img" ] || continue
    
    # Skip if already optimized
    if ! needs_optimization "$img"; then
        echo "Skipping: $(basename "$img") (already optimized)"
        skipped=$((skipped + 1))
        continue
    fi
    
    # Get original file size and dimensions
    size_before=$(get_file_size "$img")
    width_before=$(get_image_width "$img")
    total_before=$((total_before + size_before))
    
    echo "Processing: $(basename "$img")"
    echo "  Original: ${width_before}px wide, $(format_bytes $size_before)"
    
    # Optimize image
    optimize_image "$img"
    
    # Get new file size
    size_after=$(get_file_size "$img")
    total_after=$((total_after + size_after))
    savings=$((size_before - size_after))
    
    if [ $size_before -gt 0 ]; then
        percent=$((100 - (size_after * 100 / size_before)))
    else
        percent=0
    fi
    
    echo "  Optimized: ${MAX_WIDTH}x${MAX_HEIGHT}px, $(format_bytes $size_after)"
    echo "  Saved: $(format_bytes $savings) (${percent}% reduction)"
    echo ""
    
    count=$((count + 1))
done

# Summary
echo "================================"
echo "Optimization Complete!"
echo "================================"
echo "Images optimized: $count"
echo "Images skipped: $skipped"

if [ $count -gt 0 ]; then
    echo "Total before: $(format_bytes $total_before)"
    echo "Total after: $(format_bytes $total_after)"
    total_savings=$((total_before - total_after))
    
    if [ $total_before -gt 0 ]; then
        total_percent=$((100 - (total_after * 100 / total_before)))
    else
        total_percent=0
    fi
    
    echo "Total saved: $(format_bytes $total_savings) (${total_percent}% reduction)"
fi

echo ""
echo "Note: Original images from Unsplash are not backed up."
echo "Re-download from Unsplash if you need the originals."
