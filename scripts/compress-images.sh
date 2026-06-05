#!/bin/bash
# ⚡ HYDRA MULTI-FORMAT IMAGE COMPRESSION UTILITY (GOD MODE)
# Optimizes all PNG, JPG, and WebP assets recursively under public/ directory.

set -euo pipefail

TARGET_DIR="/root/esc/public"

echo "=============================================="
echo "⚡ STARTING COMPRESSION SUITE ON $TARGET_DIR"
echo "=============================================="

# 1. Install dependencies if missing
if ! command -v convert &> /dev/null; then
  echo "📦 Installing ImageMagick for PNG/JPG optimization..."
  apt-get update && apt-get install -y imagemagick
fi

if ! command -v cwebp &> /dev/null || ! command -v dwebp &> /dev/null; then
  echo "📦 Installing WebP tools..."
  apt-get update && apt-get install -y webp
fi

echo "🔍 Scanning directories for image assets..."

# Keep track of saved space
TOTAL_SAVED=0

# 2. Compress WebP images in-place (dwebp -> cwebp)
echo "🖼️ Optimizing WebP files..."
find "$TARGET_DIR" -type f -name "*.webp" 2>/dev/null | while read -r WEBP_FILE; do
  ORIG_SIZE=$(stat -c%s "$WEBP_FILE")
  
  # Decompress to temporary PNG
  TEMP_PNG="${WEBP_FILE}.temp.png"
  dwebp "$WEBP_FILE" -o "$TEMP_PNG" &>/dev/null || { rm -f "$TEMP_PNG"; continue; }
  
  # Re-compress WebP at quality 75
  cwebp -q 75 "$TEMP_PNG" -o "$WEBP_FILE" &>/dev/null
  rm -f "$TEMP_PNG"
  
  NEW_SIZE=$(stat -c%s "$WEBP_FILE")
  
  if [ "$NEW_SIZE" -lt "$ORIG_SIZE" ]; then
    SAVED=$((ORIG_SIZE - NEW_SIZE))
    TOTAL_SAVED=$((TOTAL_SAVED + SAVED))
    echo "✅ WebP optimized: $(basename "$WEBP_FILE") ($((ORIG_SIZE/1024))KB -> $((NEW_SIZE/1024))KB | -$((SAVED/1024))KB)"
  else
    # Rollback if it didn't save space (rare)
    dwebp "$WEBP_FILE" -o "$TEMP_PNG" &>/dev/null || true
    cwebp -q 90 "$TEMP_PNG" -o "$WEBP_FILE" &>/dev/null || true
    rm -f "$TEMP_PNG"
  fi
done

# 3. Compress PNG images in-place (ImageMagick)
echo "🖼️ Optimizing PNG files..."
find "$TARGET_DIR" -type f -name "*.png" 2>/dev/null | while read -r PNG_FILE; do
  ORIG_SIZE=$(stat -c%s "$PNG_FILE")
  
  # Strip metadata and compress PNG
  convert "$PNG_FILE" -strip -depth 8 "$PNG_FILE" &>/dev/null || continue
  
  NEW_SIZE=$(stat -c%s "$PNG_FILE")
  
  if [ "$NEW_SIZE" -lt "$ORIG_SIZE" ]; then
    SAVED=$((ORIG_SIZE - NEW_SIZE))
    TOTAL_SAVED=$((TOTAL_SAVED + SAVED))
    echo "✅ PNG optimized: $(basename "$PNG_FILE") ($((ORIG_SIZE/1024))KB -> $((NEW_SIZE/1024))KB | -$((SAVED/1024))KB)"
  fi
done

# 4. Compress JPG/JPEG images in-place (ImageMagick)
echo "🖼️ Optimizing JPG/JPEG files..."
find "$TARGET_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) 2>/dev/null | while read -r JPG_FILE; do
  ORIG_SIZE=$(stat -c%s "$JPG_FILE")
  
  # Strip metadata and compress JPG at quality 75
  convert "$JPG_FILE" -strip -quality 75 "$JPG_FILE" &>/dev/null || continue
  
  NEW_SIZE=$(stat -c%s "$JPG_FILE")
  
  if [ "$NEW_SIZE" -lt "$ORIG_SIZE" ]; then
    SAVED=$((ORIG_SIZE - NEW_SIZE))
    TOTAL_SAVED=$((TOTAL_SAVED + SAVED))
    echo "✅ JPG optimized: $(basename "$JPG_FILE") ($((ORIG_SIZE/1024))KB -> $((NEW_SIZE/1024))KB | -$((SAVED/1024))KB)"
  fi
done

echo "=============================================="
echo "🎉 COMPRESSION COMPLETE! Saved total: $((TOTAL_SAVED/1024/1024))MB"
echo "=============================================="
