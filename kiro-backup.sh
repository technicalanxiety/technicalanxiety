#!/bin/bash

# Kiro Configuration Backup Script
# Backs up all Kiro settings, hooks, and steering files for migration
# Works on Linux, macOS, and WSL

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="kiro-backup-$(date +%Y%m%d-%H%M%S)"
CURRENT_DIR=$(pwd)

echo -e "${GREEN}=== Kiro Configuration Backup ===${NC}"
echo "Backup directory: $BACKUP_DIR"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to backup with error handling
backup_path() {
    local source=$1
    local dest=$2
    local description=$3
    
    if [ -e "$source" ]; then
        echo -e "${GREEN}✓${NC} Backing up $description..."
        mkdir -p "$(dirname "$dest")"
        cp -r "$source" "$dest"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} Skipping $description (not found)"
        return 1
    fi
}

# Backup user-level settings
echo -e "\n${YELLOW}User-Level Settings:${NC}"
if [ -d "$HOME/.kiro/settings" ]; then
    backup_path "$HOME/.kiro/settings" "$BACKUP_DIR/user-settings" "user-level settings"
else
    echo -e "${YELLOW}⚠${NC} No user-level settings found"
fi

# Backup workspace-level settings
echo -e "\n${YELLOW}Workspace Settings:${NC}"
backup_path ".kiro/settings" "$BACKUP_DIR/workspace-settings" "workspace settings"

# Backup hooks
echo -e "\n${YELLOW}Agent Hooks:${NC}"
backup_path ".kiro/hooks" "$BACKUP_DIR/hooks" "agent hooks"

# Backup steering files
echo -e "\n${YELLOW}Steering Files:${NC}"
backup_path ".kiro/steering" "$BACKUP_DIR/steering" "steering files"

# Create system info file
echo -e "\n${YELLOW}System Information:${NC}"
cat > "$BACKUP_DIR/system-info.txt" << EOF
Kiro Backup Information
=======================
Date: $(date)
Hostname: $(hostname)
OS: $(uname -s)
User: $(whoami)
Home: $HOME
Workspace: $CURRENT_DIR

Backup Contents:
- User settings: $([ -d "$HOME/.kiro/settings" ] && echo "Yes" || echo "No")
- Workspace settings: $([ -d ".kiro/settings" ] && echo "Yes" || echo "No")
- Hooks: $([ -d ".kiro/hooks" ] && echo "Yes" || echo "No")
- Steering: $([ -d ".kiro/steering" ] && echo "Yes" || echo "No")
EOF
echo -e "${GREEN}✓${NC} Created system info file"

# Create restoration instructions
cat > "$BACKUP_DIR/RESTORE.md" << 'EOF'
# Kiro Configuration Restoration Guide

## Prerequisites

1. Install Kiro on the new system
2. Install required dependencies (Node.js, Git, etc.)
3. Have this backup directory available

## Restoration Steps

### 1. Restore User-Level Settings

```bash
# Create directory if it doesn't exist
mkdir -p ~/.kiro/settings

# Copy user settings
cp -r user-settings/* ~/.kiro/settings/
```

### 2. Clone Your Repositories

```bash
# Clone your project repositories
git clone <your-repo-url>
cd <your-repo>

# Workspace settings (.kiro/) should already be in the repo
# If not, restore them:
cp -r /path/to/backup/workspace-settings .kiro/settings
cp -r /path/to/backup/hooks .kiro/hooks
cp -r /path/to/backup/steering .kiro/steering
```

### 3. Update MCP Configurations

Edit `.kiro/settings/mcp.json` and update paths for the new system:

**Linux:**
```json
"args": ["/home/YOUR_USERNAME", "/home/YOUR_USERNAME/.kiro"]
```

**macOS:**
```json
"args": ["/Users/YOUR_USERNAME", "/Users/YOUR_USERNAME/.kiro"]
```

**Windows (WSL):**
```json
"args": ["C:\\Users\\YOUR_USERNAME", "C:\\Users\\YOUR_USERNAME\\.kiro"]
```

### 4. Verify Installation

1. Open Kiro
2. Open your workspace
3. Check MCP servers are connected (Kiro panel > MCP Servers)
4. Verify hooks are loaded (Explorer > Agent Hooks)
5. Test a simple command to ensure everything works

### 5. Troubleshooting

**MCP servers not connecting:**
- Check Node.js is installed: `node --version`
- Check npx is available: `npx --version`
- Manually reconnect from MCP panel

**Hooks not working:**
- Verify `.kiro/hooks/` directory exists
- Check hook JSON files are valid
- Restart Kiro

**Steering files not loading:**
- Verify `.kiro/steering/` directory exists
- Check markdown files are present
- Restart Kiro

## Platform-Specific Notes

### Moving from Windows to Linux/macOS

- Update all Windows paths (C:\Users\...) to Unix paths (/home/... or /Users/...)
- Line endings: Run `dos2unix` on config files if needed
- Shell commands: Update any Windows-specific commands in hooks

### Moving from Linux/macOS to Windows

- Update Unix paths to Windows paths
- Use WSL2 for better compatibility
- Update shell commands to PowerShell/cmd equivalents

## Verification Checklist

- [ ] Kiro installed and running
- [ ] User settings restored
- [ ] Workspace cloned/restored
- [ ] MCP servers connected
- [ ] Hooks visible in Explorer
- [ ] Steering files loaded
- [ ] Test command executed successfully

## Need Help?

Refer to KIRO_SETUP_DOCUMENTATION.md for complete configuration details.
EOF
echo -e "${GREEN}✓${NC} Created restoration guide"

# Create archive
echo -e "\n${YELLOW}Creating Archive:${NC}"
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
echo -e "${GREEN}✓${NC} Created archive: $BACKUP_DIR.tar.gz"

# Summary
echo -e "\n${GREEN}=== Backup Complete ===${NC}"
echo ""
echo "Backup location: $CURRENT_DIR/$BACKUP_DIR"
echo "Archive: $CURRENT_DIR/$BACKUP_DIR.tar.gz"
echo ""
echo "Files backed up:"
ls -lh "$BACKUP_DIR" | tail -n +2
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Copy $BACKUP_DIR.tar.gz to safe location"
echo "2. On new system, extract and follow RESTORE.md"
echo "3. Update paths in MCP configurations"
echo ""
echo -e "${GREEN}Backup successful!${NC}"
