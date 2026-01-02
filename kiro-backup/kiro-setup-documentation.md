# Kiro Setup Documentation

**Generated:** December 7, 2025  
**Updated:** January 2, 2026  
**Systems:** Windows 11 Pro (WSL2) + macOS (Apple Silicon)  
**User:** <jason.rinehart@technicalanxiety.com>  
**Workspace:** ~/technicalanxiety

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

#### MCP Servers (`~/.kiro/settings/mcp.json`)

1. **Fetch Server**
   - Command: `uvx mcp-server-fetch`
   - Status: Enabled
   - Auto-approved: None (manual approval required)

#### User Profile (`~/.kiro/settings/user-profile.md`)

- **Role:** Cloud Architect
- **Experience:** Intermediate Programming, Advanced Azure, Advanced IaC, Intermediate AI/ML
- **Languages:** Python, JavaScript, PowerShell, Bicep
- **Focus:** Architecture and infrastructure over application development

### Workspace-Level Settings

**Location:** `.kiro/settings/`

#### MCP Servers (`.kiro/settings/mcp.json`)

**Platform-Specific Configurations:**

1. **Fetch Server**
   - Command: `uvx mcp-server-fetch`
   - Status: Enabled
   - Auto-approved: None (manual approval required)

2. **Filesystem Server**
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

3. **Microsoft Learn**
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

- **Trigger:** On file save in `src/content/**/*.md`
- **Action:** Validates front matter, images, attribution, reading time
- **Status:** Enabled

### 5. Weekly Planning Reminder (`weekly-planning-reminder.json`)

- **Trigger:** Scheduled - Monday 9:00 AM
- **Action:** Reminds to plan next blog post
- **Status:** Enabled

---

## Steering Files

**Location:** `.kiro/steering/`

1. **astro-technical-guide.md** - Astro-specific technical guidance and workflows
2. **automated-checks.md** - Automated validation rules
3. **azure-standards.md** - Azure naming conventions, tagging, best practices
4. **blog-content-standards.md** - Blog post guidelines and standards
5. **error-handling-logging.md** - Error handling and logging practices
6. **git-workflow.md** - Git workflow and commit standards
7. **kql-writing-standards.md** - KQL query writing standards
8. **security-practices.md** - Security best practices and checklists
9. **testing-strategy.md** - Testing approaches and standards

---

## Project Type

**Astro Static Site** (Blog/Portfolio)

- Node.js-based static site generator
- Modern web framework with TypeScript support
- Images stored in `public/img/` directory
- Posts in `src/content/posts/` directory (published) and `src/content/backlog/` (drafts)
- Component-based architecture with layouts and includes
- Sass styling and modern build pipeline

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
git config --global user.name "technicalanxiety"
git config --global user.email "jason.rinehart@technicalanxiety.com"
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
   - Verify Astro serves correctly: `npm run dev`
   - Check image optimization tools
   - Confirm hooks are working

### Platform-Specific Setup Commands

**macOS (First Time Setup):**
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node git
npm install -g npm@latest

# Clone and setup
git clone git@github.com:technicalanxiety/technicalanxiety.git
cd technicalanxiety
npm install

# Update MCP configuration for macOS paths
# Edit .kiro/settings/mcp.json to use /Users/jason.rinehart paths
```

**Windows (WSL2 Setup):**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt update
sudo apt install git

# Clone and setup
git clone git@github.com:technicalanxiety/technicalanxiety.git
cd technicalanxiety
npm install

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

- **Node.js** - For Astro build system and MCP servers
- **Git** - Version control
- **npm** - Node.js package management

### Platform-Specific Installation

**Windows (WSL2):**
- Node.js via NodeSource repository
- Git via apt package manager
- npm included with Node.js

**macOS:**
- Node.js via Homebrew
- Git via Homebrew or Xcode Command Line Tools
- npm included with Node.js

### Optional Software

- **Python/uv** - For Python-based MCP servers (uvx command)
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

- **Owner:** <jason.rinehart@technicalanxiety.com>
- **Blog:** <https://technicalanxiety.com>
- **Systems:** 
  - **Personal:** ANXIETY-DESKTOP (Windows 11 Pro)
  - **Work:** MacBook Pro M4 (macOS)

---

## Changelog

- **2025-12-07:** Initial documentation created
- **2025-12-07:** RAM upgraded to 32GB (Windows workstation)
- **2025-12-14:** Updated for dual-platform usage (Windows + macOS)
- **2025-12-14:** Added platform switching workflow and setup instructions
- **2025-12-19:** Migrated from Jekyll to Astro static site generator
- **2026-01-02:** Updated documentation for current Astro configuration
- **2026-01-02:** Added user profile configuration and updated MCP servers
- **2026-01-02:** Updated contact information and repository URLs
