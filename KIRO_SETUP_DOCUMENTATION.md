# Kiro Setup Documentation

**Generated:** December 7, 2025  
**System:** Windows 11 Pro (WSL2 - Ubuntu)  
**User:** <jason.rinehart@live.com>  
**Workspace:** ~/technicalanxiety.github.io

---

## System Specifications

- **OS:** Windows 11 Pro (Build 26200)
- **CPU:** AMD Ryzen (4-core ~3.3GHz)
- **RAM:** 32GB (upgraded from 14GB)
- **Storage:** NVMe SSD
- **Shell:** WSL2 (Ubuntu) - Primary development environment
- **Network:** WiFi (Realtek 8821CE)

---

## Kiro Configuration

### User-Level Settings

**Location:** `~/.kiro/settings/`

Currently empty - no user-level MCP configurations found.

### Workspace-Level Settings

**Location:** `.kiro/settings/`

#### MCP Servers (`.kiro/settings/mcp.json`)

1. **Filesystem Server**
   - Command: `npx -y @modelcontextprotocol/server-filesystem`
   - Paths: `C:\Users\jason`, `C:\Users\jason\.kiro`
   - Auto-approved: `read_file`, `read_multiple_files`, `list_directory`, `search_files`
   - Status: Enabled

2. **Microsoft Learn**
   - URL: `https://learn.microsoft.com/api/mcp`
   - Auto-approved: `search_documentation`, `get_article`
   - Status: Enabled

---

## Agent Hooks

**Location:** `.kiro/hooks/`

### 1. Check Image Optimization (`check-image-optimization.json`)

- **Trigger:** On file save in `img/**/*.{jpg,jpeg,png}`
- **Action:** Validates image optimization (size, dimensions, compression)
- **Status:** Enabled

### 2. Pre-Commit Checklist (`pre-commit-checklist.json`)

- **Trigger:** Before commit
- **Action:** Displays pre-publish checklist for blog posts
- **Status:** Enabled

### 3. Update Changelog (`update-changelog.json`)

- **Trigger:** On file save in layouts, includes, sass, js, config files
- **Action:** Prompts to update CHANGELOG.md
- **Status:** Enabled

### 4. Validate Post on Save (`validate-post-on-save.json`)

- **Trigger:** On file save in `_posts/**/*.md`
- **Action:** Validates front matter, images, attribution, reading time
- **Status:** Enabled

### 5. Weekly Planning Reminder (`weekly-planning-reminder.json`)

- **Trigger:** Scheduled - Monday 9:00 AM
- **Action:** Reminds to plan next blog post
- **Status:** Enabled

---

## Steering Files

**Location:** `.kiro/steering/`

1. **automated-checks.md** - Automated validation rules
2. **azure-standards.md** - Azure naming conventions, tagging, best practices
3. **blog-content-standards.md** - Blog post guidelines and standards
4. **error-handling-logging.md** - Error handling and logging practices
5. **git-workflow.md** - Git workflow and commit standards
6. **jekyll-technical-guide.md** - Jekyll-specific technical guidance
7. **security-practices.md** - Security best practices and checklists
8. **testing-strategy.md** - Testing approaches and standards

---

## Project Type

**Jekyll Static Site** (Blog/Portfolio)

- Ruby-based static site generator
- Minimal resource requirements
- Images stored in `/img/` directory
- Posts in `_posts/` directory
- Custom layouts, includes, and Sass styling

---

## Migration Notes

### Cross-Platform Considerations

**Current:** WSL2 (Ubuntu) on Windows 11  
**Future:** Native Linux or macOS

#### Path Differences

- **Windows (WSL):** `/home/anxiety/.kiro/`
- **Linux:** `/home/[user]/.kiro/`
- **macOS:** `/Users/[user]/.kiro/`

#### MCP Configuration Adjustments Needed

**Filesystem Server** - Windows paths need conversion:

```json
// Current (Windows)
"args": ["C:\\Users\\jason", "C:\\Users\\jason\\.kiro"]

// Linux
"args": ["/home/anxiety", "/home/anxiety/.kiro"]

// macOS
"args": ["/Users/jason", "/Users/jason/.kiro"]
```

**Commands** - Should work cross-platform:

- `npx` - Works on all platforms (requires Node.js)
- `uvx` - Works on all platforms (requires uv/Python)

---

## Backup Strategy

### What to Backup

1. **User-level settings:** `~/.kiro/settings/`
2. **Workspace settings:** `.kiro/settings/`
3. **Agent hooks:** `.kiro/hooks/`
4. **Steering files:** `.kiro/steering/`

### What NOT to Backup

- Kiro application files (reinstall on new system)
- Indexed codebase data (regenerates automatically)
- Chat history (optional, not critical)
- Temporary files

---

## Restoration Process

### On New System

1. **Install Kiro** (platform-specific installer)

2. **Restore user-level settings:**

   ```bash
   mkdir -p ~/.kiro/settings
   cp backup/user-settings/* ~/.kiro/settings/
   ```

3. **Clone repositories** (workspace settings come with them):

   ```bash
   git clone <repo-url>
   cd <repo>
   # .kiro/ folder is already there
   ```

4. **Update MCP configurations** for new platform:
   - Edit `.kiro/settings/mcp.json`
   - Update file paths for filesystem server
   - Verify command availability (npx, uvx, etc.)

5. **Test MCP servers:**
   - Reconnect servers from Kiro MCP panel
   - Verify tools are working

6. **Verify hooks and steering:**
   - Check hooks are enabled
   - Confirm steering files are loaded

---

## Dependencies

### Required Software

- **Node.js** - For npx and filesystem MCP server
- **Git** - Version control
- **Ruby** - For Jekyll (project-specific)
- **Bundler** - Ruby dependency management (project-specific)

### Optional Software

- **Python/uv** - For Python-based MCP servers (if added)
- **Docker** - For containerized development (if needed)

---

## Security Notes

- MCP filesystem server has access to `C:\Users\jason` and `.kiro` directories
- Auto-approved tools are read-only operations
- No secrets stored in Kiro configuration files
- Steering files contain best practices, no sensitive data

---

## Performance Optimization Applied

- 32GB RAM upgrade (from 14GB)
- NVMe SSD for OS and development
- WSL2 for better Linux tooling performance
- Minimal background processes

---

## Contact & Support

- **Owner:** <jason.rinehart@live.com>
- **Blog:** <https://technicalanxiety.github.io>
- **System Name:** ANXIETY-DESKTOP

---

## Changelog

- **2025-12-07:** Initial documentation created
- **2025-12-07:** RAM upgraded to 32GB
