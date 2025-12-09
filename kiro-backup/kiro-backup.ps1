# Kiro Configuration Backup Script (PowerShell)
# Backs up all Kiro settings, hooks, and steering files for migration
# Works on Windows (PowerShell)

$ErrorActionPreference = "Stop"

# Configuration
$BackupBaseDir = "kiro-backup"
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$BackupFile = "kiro-backup-$Timestamp.zip"
$CurrentDir = Get-Location
$MaxBackups = 3

Write-Host "=== Kiro Configuration Backup ===" -ForegroundColor Green
Write-Host "Backup directory: $BackupBaseDir"
Write-Host "Backup file: $BackupFile"
Write-Host ""

# Create backup directory if it doesn't exist
if (-not (Test-Path $BackupBaseDir)) {
    New-Item -ItemType Directory -Path $BackupBaseDir -Force | Out-Null
}

# Create temporary directory for this backup
$TempBackupDir = New-Item -ItemType Directory -Path (Join-Path $env:TEMP "kiro-backup-$Timestamp") -Force

# Function to backup with error handling
function Backup-Path {
    param(
        [string]$Source,
        [string]$Dest,
        [string]$Description
    )
    
    if (Test-Path $Source) {
        Write-Host "✓ Backing up $Description..." -ForegroundColor Green
        $DestDir = Split-Path -Parent $Dest
        if ($DestDir) {
            New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
        }
        Copy-Item -Path $Source -Destination $Dest -Recurse -Force
        return $true
    } else {
        Write-Host "⚠ Skipping $Description (not found)" -ForegroundColor Yellow
        return $false
    }
}

# Backup user-level settings
Write-Host "`nUser-Level Settings:" -ForegroundColor Yellow
$UserSettings = "$env:USERPROFILE\.kiro\settings"
if (Test-Path $UserSettings) {
    Backup-Path $UserSettings "$BackupDir\user-settings" "user-level settings"
} else {
    Write-Host "⚠ No user-level settings found" -ForegroundColor Yellow
}

# Backup workspace-level settings
Write-Host "`nWorkspace Settings:" -ForegroundColor Yellow
Backup-Path ".kiro\settings" "$BackupDir\workspace-settings" "workspace settings"

# Backup hooks
Write-Host "`nAgent Hooks:" -ForegroundColor Yellow
Backup-Path ".kiro\hooks" "$BackupDir\hooks" "agent hooks"

# Backup steering files
Write-Host "`nSteering Files:" -ForegroundColor Yellow
Backup-Path ".kiro\steering" "$BackupDir\steering" "steering files"

# Create system info file
Write-Host "`nSystem Information:" -ForegroundColor Yellow
$SystemInfo = @"
Kiro Backup Information
=======================
Date: $(Get-Date)
Hostname: $env:COMPUTERNAME
OS: $((Get-CimInstance Win32_OperatingSystem).Caption)
User: $env:USERNAME
Home: $env:USERPROFILE
Workspace: $CurrentDir

Backup Contents:
- User settings: $(if (Test-Path "$env:USERPROFILE\.kiro\settings") { "Yes" } else { "No" })
- Workspace settings: $(if (Test-Path ".kiro\settings") { "Yes" } else { "No" })
- Hooks: $(if (Test-Path ".kiro\hooks") { "Yes" } else { "No" })
- Steering: $(if (Test-Path ".kiro\steering") { "Yes" } else { "No" })
"@
$SystemInfo | Out-File "$BackupDir\system-info.txt" -Encoding UTF8
Write-Host "✓ Created system info file" -ForegroundColor Green

# Create restoration instructions
$RestoreGuide = @'
# Kiro Configuration Restoration Guide

## Prerequisites

1. Install Kiro on the new system
2. Install required dependencies (Node.js, Git, etc.)
3. Have this backup directory available

## Restoration Steps

### 1. Restore User-Level Settings

**PowerShell (Windows):**
```powershell
# Create directory if it doesn't exist
New-Item -ItemType Directory -Path "$env:USERPROFILE\.kiro\settings" -Force

# Copy user settings
Copy-Item -Path "user-settings\*" -Destination "$env:USERPROFILE\.kiro\settings\" -Recurse -Force
```

**Bash (Linux/macOS):**
```bash
mkdir -p ~/.kiro/settings
cp -r user-settings/* ~/.kiro/settings/
```

### 2. Clone Your Repositories

```bash
# Clone your project repositories
git clone <your-repo-url>
cd <your-repo>

# Workspace settings (.kiro/) should already be in the repo
# If not, restore them manually
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

**Windows:**
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
'@
$RestoreGuide | Out-File "$BackupDir\RESTORE.md" -Encoding UTF8
Write-Host "✓ Created restoration guide" -ForegroundColor Green

# Create archive
Write-Host "`nCreating Archive:" -ForegroundColor Yellow
Compress-Archive -Path $BackupDir -DestinationPath "$BackupDir.zip" -Force
Write-Host "✓ Created archive: $BackupDir.zip" -ForegroundColor Green

# Summary
Write-Host "`n=== Backup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Backup location: $CurrentDir\$BackupDir"
Write-Host "Archive: $CurrentDir\$BackupDir.zip"
Write-Host ""
Write-Host "Files backed up:"
Get-ChildItem $BackupDir | Format-Table Name, Length, LastWriteTime
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy $BackupDir.zip to safe location"
Write-Host "2. On new system, extract and follow RESTORE.md"
Write-Host "3. Update paths in MCP configurations"
Write-Host ""
Write-Host "Backup successful!" -ForegroundColor Green
