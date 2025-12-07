# Kiro Backup & Migration Guide

This directory contains scripts and documentation for backing up and migrating your Kiro configuration across systems.

## Files

- **KIRO_SETUP_DOCUMENTATION.md** - Complete documentation of your current Kiro setup
- **kiro-backup.sh** - Bash script for Linux/macOS/WSL backup
- **kiro-backup.ps1** - PowerShell script for Windows backup
- **README-BACKUP.md** - This file

## Quick Start

### Running the Backup

**On Linux/macOS/WSL:**
```bash
chmod +x kiro-backup.sh
./kiro-backup.sh
```

**On Windows (PowerShell):**
```powershell
.\kiro-backup.ps1
```

### What Gets Backed Up

1. **User-level settings** (`~/.kiro/settings/`)
   - MCP server configurations
   - Global Kiro preferences

2. **Workspace settings** (`.kiro/settings/`)
   - Workspace-specific MCP configs
   - Project-specific settings

3. **Agent hooks** (`.kiro/hooks/`)
   - Automated workflow triggers
   - Custom hook configurations

4. **Steering files** (`.kiro/steering/`)
   - Custom guidelines and standards
   - Project-specific rules

### Output

The script creates:
- A timestamped backup directory with all files
- A compressed archive (.tar.gz or .zip)
- System information file
- Restoration guide (RESTORE.md)

## Migration Workflow

### 1. On Current System

```bash
# Run backup script
./kiro-backup.sh

# Copy the archive to safe location
cp kiro-backup-YYYYMMDD-HHMMSS.tar.gz /path/to/safe/location/
```

### 2. On New System

```bash
# Extract backup
tar -xzf kiro-backup-YYYYMMDD-HHMMSS.tar.gz
cd kiro-backup-YYYYMMDD-HHMMSS

# Follow RESTORE.md instructions
cat RESTORE.md
```

### 3. Update Configurations

Edit `.kiro/settings/mcp.json` to match new system paths:

**From Windows to Linux:**
```json
// Before (Windows)
"args": ["C:\\Users\\jason", "C:\\Users\\jason\\.kiro"]

// After (Linux)
"args": ["/home/jason", "/home/jason/.kiro"]
```

**From Windows to macOS:**
```json
// Before (Windows)
"args": ["C:\\Users\\jason", "C:\\Users\\jason\\.kiro"]

// After (macOS)
"args": ["/Users/jason", "/Users/jason/.kiro"]
```

## Cross-Platform Notes

### Path Conversions

| Platform | Home Directory | Kiro Settings |
|----------|---------------|---------------|
| Windows | `C:\Users\username` | `C:\Users\username\.kiro` |
| Linux | `/home/username` | `/home/username/.kiro` |
| macOS | `/Users/username` | `/Users/username/.kiro` |
| WSL | `/home/username` | `/home/username/.kiro` |

### Command Compatibility

Most commands work cross-platform:
- `npx` - Node.js (all platforms)
- `uvx` - Python uv (all platforms)

Platform-specific adjustments may be needed for:
- File paths in MCP configs
- Shell commands in hooks
- Environment variables

## Best Practices

1. **Regular Backups**
   - Run backup before major changes
   - Keep backups when switching systems
   - Store backups in version control (without secrets)

2. **Version Control**
   - Commit `.kiro/` directory to git
   - Add `.gitignore` for sensitive files
   - Document changes in commit messages

3. **Testing**
   - Test backup/restore on non-critical workspace first
   - Verify MCP servers connect after restore
   - Check hooks and steering files load correctly

4. **Documentation**
   - Keep KIRO_SETUP_DOCUMENTATION.md updated
   - Document custom configurations
   - Note platform-specific quirks

## Troubleshooting

### Backup Script Fails

**Permission denied:**
```bash
chmod +x kiro-backup.sh
```

**Directory not found:**
- Ensure you're in a workspace with `.kiro/` directory
- User-level settings are optional (may not exist)

### Restore Issues

**MCP servers not connecting:**
- Verify Node.js installed: `node --version`
- Check paths in mcp.json are correct for new system
- Manually reconnect from Kiro MCP panel

**Hooks not loading:**
- Verify `.kiro/hooks/` exists in workspace
- Check JSON syntax is valid
- Restart Kiro

**Steering files not working:**
- Verify `.kiro/steering/` exists
- Check markdown files are present
- Confirm files have proper front matter (if required)

## Security Considerations

- Backup scripts do NOT include secrets or credentials
- MCP configs may contain file paths (not sensitive)
- Review backup contents before sharing
- Store backups securely

## Support

For detailed configuration information, see:
- **KIRO_SETUP_DOCUMENTATION.md** - Your complete setup
- **RESTORE.md** (in backup) - Step-by-step restoration
- Kiro documentation - Official guides

---

**Last Updated:** December 7, 2025  
**System:** Windows 11 Pro (WSL2)  
**Owner:** jason.rinehart@live.com
