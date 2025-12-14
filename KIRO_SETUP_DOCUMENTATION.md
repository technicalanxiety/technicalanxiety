# Kiro Setup Documentation

**Generated:** December 7, 2025  
**Updated:** December 14, 2025  
**Systems:** Windows 11 Pro (WSL2) + macOS (Apple Silicon)  
**User:** <jason.rinehart@live.com>  
**Workspace:** ~/technicalanxiety.github.io

---

## System Specifications

### Primary Workstation (Personal)
- **OS:** Windows 11 Pro (Build 26200)
- **CPU:** AMD Ryzen (4-core ~3.3GHz)
- **RAM:** 32GB (upgraded from 14GB)
- **Storage:** NVMe SSD
- **Shell:** WSL2 (Ubuntu) - Primary development environment
- **Network:** WiFi (Realtek 8821CE)

### Secondary Workstation (Work)
- **OS:** macOS Tahoe 26.2 (Apple Silicon)
- **CPU:** Apple M4 (8-core)
- **RAM:** 16GB
- **Storage:** SSD
- **Shell:** zsh (native macOS)

---

## Kiro Configuration

### User-Level Settings

**Location:** `~/.kiro/settings/`

Currently empty - no user-level MCP configurations found.

### Workspace-Level Settings

**Location:** `.kiro/settings/`

#### MCP Servers (`.kiro/settings/mcp.json`)

**Platform-Specific Configurations:**

1. **Filesystem Server**
   - Command: `npx -y @modelcontextprotocol/server-filesystem`
   - Auto-approved: `read_file`, `read_multiple_files`, `list_directory`, `search_files`
   - Status: Enabled
   
   **Windows (WSL2):**
   ```json
   "args": ["C:\\Users\\jason", "C:\\Users\\jason\\.kiro"]
   ```
   
   **macOS:**
   ```json
   "args": ["/Users/jason.rinehart", "/Users/jason.rinehart/.kiro"]
   ```

2. **Microsoft Learn**
   - URL: `https://learn.microsoft.com/api/mcp`
   - Auto-approved: `search_documentation`, `get_article`
   - Status: Enabled
   - **Note:** Platform-independent configuration

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

## Dual-Platform Usage

### Active Workstations

**Windows (Personal):** WSL2 Ubuntu environment  
**macOS (Work):** Native zsh shell

### Platform-Specific Considerations

#### File Paths
- **Windows:** `C:\Users\jason\.kiro\`
- **macOS:** `/Users/jason.rinehart/.kiro/`

#### Git Configuration
Ensure consistent git config across both systems:
```bash
git config --global user.name "Jason Rinehart"
git config --global user.email "jason.rinehart@live.com"
```

#### MCP Server Compatibility
- **npx commands:** Work on both platforms (requires Node.js)
- **uvx commands:** Work on both platforms (requires uv/Python)
- **File paths:** Must be updated per platform in `.kiro/settings/mcp.json`

## Platform Switching Workflow

### When Moving Between Workstations

1. **Commit and push** current work:
   ```bash
   git add .
   git commit -m "Work in progress"
   git push
   ```

2. **Pull latest** on new workstation:
   ```bash
   git pull origin master
   ```

3. **Verify MCP configuration** matches platform:
   - Check `.kiro/settings/mcp.json` file paths
   - Reconnect MCP servers if needed from Kiro MCP panel

4. **Test environment:**
   - Verify Jekyll serves correctly: `bundle exec jekyll serve`
   - Check image optimization tools
   - Confirm hooks are working

### Platform-Specific Setup Commands

**macOS (First Time Setup):**
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node ruby git
gem install bundler jekyll

# Clone and setup
git clone git@github.com-personal:technicalanxiety/technicalanxiety.github.io.git
cd technicalanxiety.github.io
bundle install

# Update MCP configuration for macOS paths
# Edit .kiro/settings/mcp.json to use /Users/jason.rinehart paths
```

**Windows (WSL2 Setup):**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Ruby and Jekyll
sudo apt update
sudo apt install ruby-full build-essential zlib1g-dev
gem install bundler jekyll

# Clone and setup
git clone git@github.com-personal:technicalanxiety/technicalanxiety.github.io.git
cd technicalanxiety.github.io
bundle install

# MCP configuration uses C:\Users\jason paths
```

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

### Required Software (Both Platforms)

- **Node.js** - For npx and filesystem MCP server
- **Git** - Version control
- **Ruby** - For Jekyll (project-specific)
- **Bundler** - Ruby dependency management (project-specific)

### Platform-Specific Installation

**Windows (WSL2):**
- Node.js via NodeSource repository
- Ruby via apt package manager
- Git via apt package manager

**macOS:**
- Node.js via Homebrew
- Ruby via Homebrew (or system Ruby)
- Git via Homebrew or Xcode Command Line Tools

### Optional Software

- **Python/uv** - For Python-based MCP servers (if added)
- **Docker** - For containerized development (if needed)

---

## Security Notes

### File System Access
- **Windows:** MCP filesystem server has access to `C:\Users\jason` and `.kiro` directories
- **macOS:** MCP filesystem server has access to `/Users/jason.rinehart` and `.kiro` directories
- Auto-approved tools are read-only operations only
- No secrets stored in Kiro configuration files
- Steering files contain best practices, no sensitive data

### Cross-Platform Considerations
- Git SSH keys should be configured on both systems
- Consistent user identity across platforms
- No sensitive data in committed configuration files

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
- **Systems:** 
  - **Personal:** ANXIETY-DESKTOP (Windows 11 Pro)
  - **Work:** MacBook Pro M4 (macOS)

---

## Changelog

- **2025-12-07:** Initial documentation created
- **2025-12-07:** RAM upgraded to 32GB (Windows workstation)
- **2025-12-14:** Updated for dual-platform usage (Windows + macOS)
- **2025-12-14:** Added platform switching workflow and setup instructions
