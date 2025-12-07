---
inclusion: manual
---

# Git Workflow & Standards

## Branching Strategy: Feature Branches

### Branch Structure
```
main (protected)
├── feature/user-authentication
├── feature/api-integration
├── bugfix/login-error
└── hotfix/security-patch
```

### Branch Naming Convention
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

**Examples:**
- `feature/add-user-registration`
- `bugfix/fix-login-timeout`
- `hotfix/patch-security-vulnerability`
- `refactor/improve-error-handling`

### Workflow

1. **Create Feature Branch**
```bash
git checkout main
git pull origin main
git checkout -b feature/my-new-feature
```

2. **Work on Feature**
```bash
# Make changes
git add .
git commit -m "feat: add user registration endpoint"

# Keep branch updated
git fetch origin
git rebase origin/main
```

3. **Push and Create PR**
```bash
git push origin feature/my-new-feature
# Create pull request on GitHub
```

4. **After PR Approval**
```bash
# Merge via GitHub UI (squash or merge commit)
# Delete feature branch
git branch -d feature/my-new-feature
```

## Commit Message Standards

### Conventional Commits Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build, etc.)
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

**Simple commit:**
```
feat: add user authentication endpoint
```

**Detailed commit:**
```
feat(auth): implement JWT-based authentication

- Add JWT token generation and validation
- Create middleware for protected routes
- Add refresh token functionality
- Update API documentation

Closes #123
```

**Bug fix:**
```
fix(api): resolve timeout issue in data fetch

The API was timing out on large datasets due to missing
pagination. Added pagination with configurable page size.

Fixes #456
```

**Breaking change:**
```
feat(api)!: change authentication to use OAuth2

BREAKING CHANGE: The API now requires OAuth2 tokens instead
of API keys. Clients must update their authentication flow.

Migration guide: docs/oauth2-migration.md
```

### Commit Message Guidelines

**Subject Line:**
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter (except proper nouns)
- No period at the end
- Keep under 72 characters
- Be descriptive but concise

**Body:**
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

**Footer:**
- Reference issues: `Closes #123`, `Fixes #456`, `Relates to #789`
- Note breaking changes: `BREAKING CHANGE: description`

## Pull Request Process

### Always Require Reviews
- No direct commits to `main`
- Minimum 1 reviewer approval
- All CI checks must pass
- No merge conflicts

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Related Issues
Closes #123
```

### PR Best Practices

**Keep PRs Small:**
- Focus on single feature/fix
- Easier to review
- Faster to merge
- Less risk of conflicts

**Write Good Descriptions:**
- Explain what and why
- Include screenshots for UI changes
- Link to related issues
- Note any breaking changes

**Respond to Feedback:**
- Address all comments
- Ask questions if unclear
- Update PR based on feedback
- Re-request review after changes

## Protected Branch Rules

### Main Branch Protection
```yaml
# GitHub branch protection settings
main:
  required_reviews: 1
  dismiss_stale_reviews: true
  require_code_owner_reviews: false
  required_status_checks:
    - ci/tests
    - ci/lint
  enforce_admins: true
  allow_force_pushes: false
  allow_deletions: false
```

## Git Best Practices

### Commit Often
- Small, logical commits
- Each commit should be a complete thought
- Easier to review and revert if needed

### Write Meaningful Messages
```bash
# ❌ Bad
git commit -m "fix"
git commit -m "updates"
git commit -m "wip"

# ✅ Good
git commit -m "fix: resolve null pointer in user service"
git commit -m "feat: add pagination to search results"
git commit -m "docs: update API authentication guide"
```

### Keep History Clean
```bash
# Rebase before merging to keep linear history
git fetch origin
git rebase origin/main

# Squash commits if needed (before pushing)
git rebase -i HEAD~3

# Amend last commit if you forgot something
git add forgotten-file.py
git commit --amend --no-edit
```

### Never Commit Secrets
```bash
# If you accidentally commit a secret:
# 1. Rotate the secret immediately
# 2. Remove from history (if not pushed)
git reset HEAD~1

# 3. If already pushed, use git-filter-repo or BFG
# 4. Force push (only if branch not shared)
git push --force-with-lease
```

## Useful Git Commands

### Daily Workflow
```bash
# Update local main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Stage changes
git add .
git status

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/my-feature

# Update feature branch with main
git fetch origin
git rebase origin/main
```

### Fixing Mistakes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo changes to file
git checkout -- filename

# Stash changes temporarily
git stash
git stash pop

# View commit history
git log --oneline --graph --all
```

### Collaboration
```bash
# Fetch all branches
git fetch --all

# Checkout someone else's branch
git checkout -b feature/their-feature origin/feature/their-feature

# View remote branches
git branch -r

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

## .gitignore Best Practices

### Always Ignore
```gitignore
# Secrets and credentials
.env
.env.local
*.key
*.pem
secrets.json
credentials.json

# Dependencies
node_modules/
venv/
__pycache__/

# Build outputs
dist/
build/
*.pyc
*.pyo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Test coverage
coverage/
.coverage
htmlcov/
```

## Git Hooks (Optional)

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run linter
echo "Running linter..."
npm run lint || exit 1

# Run tests
echo "Running tests..."
npm test || exit 1

echo "Pre-commit checks passed!"
```

### Commit Message Hook
```bash
#!/bin/bash
# .git/hooks/commit-msg

# Validate commit message format
commit_msg=$(cat "$1")

if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci)(\(.+\))?: .+"; then
    echo "Error: Commit message doesn't follow conventional commits format"
    echo "Format: <type>(<scope>): <subject>"
    echo "Example: feat(auth): add login endpoint"
    exit 1
fi
```

## Remember

- **Commit early, commit often** - Small commits are easier to review
- **Write clear messages** - Future you will thank you
- **Keep main stable** - Never break the main branch
- **Review thoroughly** - Code review catches bugs and shares knowledge
- **Communicate** - Use PR descriptions and comments effectively
- **Stay organized** - Clean branch names and commit history matter
