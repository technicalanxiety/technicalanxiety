# MCP Server Configuration

Model Context Protocol (MCP) servers provide additional capabilities to Kiro. This document explains how to configure MCP servers for the Technical Anxiety blog.

## Prerequisites

### For Python-based MCP servers (Microsoft Learn)
Install `uv` and `uvx`:

**Windows (PowerShell):**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Linux/WSL:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**macOS:**
```bash
brew install uv
```

### For Node-based MCP servers (Filesystem)
Node.js and npm should already be installed. If not:
```bash
# Check if installed
node --version
npm --version

# Install if needed (Ubuntu/WSL)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Configuration File Location

MCP configuration is stored at the **user level** (not in the workspace):

**Location**: `~/.kiro/settings/mcp.json`

This file applies across all your projects.

## Recommended MCP Servers

### 1. Filesystem Server
Provides enhanced file system access for reading, writing, and searching files.

**Capabilities:**
- Read single or multiple files
- List directory contents
- Search files by pattern
- Create and modify files

**Use case**: Better file operations for blog management

### 2. Microsoft Learn Server
Provides access to Microsoft Learn documentation for Azure and other Microsoft technologies.

**Capabilities:**
- Search Microsoft Learn documentation
- Get specific articles
- Access Azure documentation
- Find code examples and tutorials

**Use case**: Research Azure topics for blog posts, verify technical accuracy

## Configuration

Create or edit `~/.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/anxiety/technicalanxiety.github.io",
        "/home/anxiety/.kiro"
      ],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": [
        "read_file",
        "read_multiple_files",
        "list_directory",
        "search_files"
      ]
    },
    "microsoft-learn": {
      "command": "uvx",
      "args": [
        "mcp-server-microsoft-learn"
      ],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": [
        "search_documentation",
        "get_article"
      ]
    }
  }
}
```

### Configuration Explanation

**filesystem server:**
- `command`: Uses `npx` to run the filesystem server
- `args`: Specifies allowed directories (blog repo and .kiro config)
- `autoApprove`: Auto-approves read operations (no manual confirmation needed)

**microsoft-learn server:**
- `command`: Uses `uvx` to run the Microsoft Learn server
- `autoApprove`: Auto-approves documentation search and retrieval

## Setup Steps

### 1. Install Prerequisites
```bash
# Install uv/uvx for Python MCP servers
curl -LsSf https://astral.sh/uv/install.sh | sh

# Verify installation
uvx --version
```

### 2. Create MCP Configuration
```bash
# Create directory if it doesn't exist
mkdir -p ~/.kiro/settings

# Create or edit mcp.json
nano ~/.kiro/settings/mcp.json
# Or use your preferred editor
```

### 3. Paste Configuration
Copy the JSON configuration above into the file.

### 4. Adjust Paths (if needed)
Update the filesystem server paths to match your setup:
```json
"args": [
  "-y",
  "@modelcontextprotocol/server-filesystem",
  "/your/actual/path/to/blog",
  "/home/yourusername/.kiro"
]
```

### 5. Restart Kiro
Close and reopen Kiro for changes to take effect.

### 6. Verify MCP Servers
In Kiro, you can verify MCP servers are running:
- Open Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
- Search for "MCP"
- Check "MCP Server Status" or similar command

## Usage Examples

### Filesystem Server
```
"Read the contents of _posts/2025-12-04-debugging-myself.md"
"List all files in the img/ directory"
"Search for posts containing 'Azure governance'"
```

### Microsoft Learn Server
```
"Search Microsoft Learn for Azure Key Vault best practices"
"Get the article about Azure Bicep deployment"
"Find documentation on Azure Policy"
```

## Troubleshooting

### MCP Server Not Starting

**Check if uvx is installed:**
```bash
uvx --version
```

**Check if npx is installed:**
```bash
npx --version
```

**View MCP server logs:**
- Check Kiro output panel for MCP-related errors
- Look for connection or startup issues

### Permission Issues

If filesystem server can't access directories:
```bash
# Check directory permissions
ls -la ~/technicalanxiety.github.io
ls -la ~/.kiro

# Ensure you have read/write access
```

### Server Keeps Disconnecting

1. Check the `FASTMCP_LOG_LEVEL` setting
2. Try setting to "DEBUG" temporarily to see detailed logs
3. Verify paths are correct and accessible
4. Restart Kiro

## Additional MCP Servers (Optional)

### GitHub MCP Server
Access GitHub repositories, issues, and PRs:
```json
"github": {
  "command": "uvx",
  "args": ["mcp-server-github"],
  "env": {
    "GITHUB_TOKEN": "your-github-token"
  },
  "disabled": false
}
```

### Brave Search MCP Server
Web search capabilities:
```json
"brave-search": {
  "command": "uvx",
  "args": ["mcp-server-brave-search"],
  "env": {
    "BRAVE_API_KEY": "your-api-key"
  },
  "disabled": false
}
```

## Security Notes

- **autoApprove**: Only auto-approve operations you trust
- **Paths**: Limit filesystem access to necessary directories
- **Tokens**: Store API tokens securely (use environment variables)
- **Review**: Periodically review which servers are enabled

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [Filesystem Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [Microsoft Learn Server](https://github.com/modelcontextprotocol/servers/tree/main/src/microsoft-learn)

## Notes

- MCP configuration is at user level, not workspace level
- Changes require Kiro restart
- Servers run in background and connect automatically
- Can enable/disable servers without removing configuration
- Use `"disabled": true` to temporarily disable a server
