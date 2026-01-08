#!/bin/bash

# Script to setup MCP configuration based on platform
# Usage: ./scripts/setup-mcp.sh

# Detect platform
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
else
    echo "Unsupported platform: $OSTYPE"
    exit 1
fi

echo "Detected platform: $PLATFORM"

# Copy platform-specific config
SOURCE_CONFIG=".kiro/settings/mcp.$PLATFORM.json"
TARGET_CONFIG=".kiro/settings/mcp.json"

if [ -f "$SOURCE_CONFIG" ]; then
    cp "$SOURCE_CONFIG" "$TARGET_CONFIG"
    echo "✅ MCP configuration updated for $PLATFORM"
    echo "📁 Copied $SOURCE_CONFIG to $TARGET_CONFIG"
else
    echo "❌ Platform config not found: $SOURCE_CONFIG"
    exit 1
fi

# Also update global config if it exists
GLOBAL_CONFIG="$HOME/.kiro/settings/mcp.json"
if [ -f "$GLOBAL_CONFIG" ]; then
    echo "🔄 Updating global MCP config..."
    cp "$SOURCE_CONFIG" "$GLOBAL_CONFIG"
    echo "✅ Global MCP configuration updated"
fi

echo "🎉 MCP setup complete for $PLATFORM"