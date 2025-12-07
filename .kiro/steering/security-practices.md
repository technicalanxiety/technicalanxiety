---
inclusion: fileMatch
fileMatchPattern: "**/*.{py,js,ts,ps1,sh,bicep,json,yml,yaml}"
---

# Security Practices: Secure Everything

## Core Principle

Security is not optional. Every project, every script, every deployment must follow security best practices.

## Secrets Management

### Never Hardcode Secrets
```python
# ❌ NEVER DO THIS
api_key = "sk-1234567890abcdef"
connection_string = "Server=prod.db;Password=MyPassword123"

# ✅ DO THIS
import os
api_key = os.environ.get("API_KEY")
connection_string = os.environ.get("DB_CONNECTION_STRING")

if not api_key:
    raise ValueError("API_KEY environment variable not set")
```

### Secret Storage Options

**Azure Key Vault** (Preferred for Azure workloads)
```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
client = SecretClient(
    vault_url="https://myvault.vault.azure.net/",
    credential=credential
)

secret = client.get_secret("database-password")
db_password = secret.value
```

**Environment Variables** (Local development, containers)
```bash
# .env file (NEVER commit this)
API_KEY=your-secret-key
DB_PASSWORD=your-db-password

# .env.example (commit this as template)
API_KEY=your-api-key-here
DB_PASSWORD=your-database-password-here
```

```python
# Load from .env file
from dotenv import load_dotenv
import os

load_dotenv()  # Load .env file
api_key = os.getenv("API_KEY")
```

**GitHub Secrets** (CI/CD pipelines)
- Store secrets in repository settings
- Access via `${{ secrets.SECRET_NAME }}`
- Never log secret values

### .gitignore Essentials
```gitignore
# Secrets and credentials
.env
.env.local
*.key
*.pem
secrets.json
credentials.json

# Azure
local.settings.json
*.publishsettings

# Python
__pycache__/
*.pyc

# Node
node_modules/
.env.local

# IDE
.vscode/settings.json
.idea/
```

## Input Validation

### Validate Everything
```python
def process_user_input(user_id: str, amount: float):
    """Process user input with validation."""
    # Validate user_id format
    if not user_id or not isinstance(user_id, str):
        raise ValueError("Invalid user_id")
    
    if not user_id.isalnum():
        raise ValueError("user_id must be alphanumeric")
    
    # Validate amount
    if not isinstance(amount, (int, float)):
        raise ValueError("amount must be numeric")
    
    if amount <= 0:
        raise ValueError("amount must be positive")
    
    if amount > 10000:
        raise ValueError("amount exceeds maximum allowed")
    
    # Process with validated input
    return process_transaction(user_id, amount)
```

### SQL Injection Prevention
```python
# ❌ NEVER DO THIS
query = f"SELECT * FROM users WHERE email = '{email}'"
cursor.execute(query)

# ✅ DO THIS - Use parameterized queries
query = "SELECT * FROM users WHERE email = ?"
cursor.execute(query, (email,))

# ✅ OR USE ORM
user = User.query.filter_by(email=email).first()
```

### Command Injection Prevention
```python
import subprocess
import shlex

# ❌ NEVER DO THIS
filename = user_input
os.system(f"cat {filename}")

# ✅ DO THIS - Use subprocess with list
subprocess.run(["cat", filename], check=True)

# ✅ OR validate and sanitize
if not filename.isalnum():
    raise ValueError("Invalid filename")
```

## Authentication & Authorization

### Azure AD / Entra ID Integration
```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

# Use managed identity or Azure CLI credentials
credential = DefaultAzureCredential()

# Client automatically handles token refresh
client = ResourceManagementClient(credential, subscription_id)
```

### API Authentication
```python
from functools import wraps
from flask import request, jsonify

def require_api_key(f):
    """Decorator to require API key authentication."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        
        if not api_key:
            return jsonify({"error": "API key required"}), 401
        
        if not validate_api_key(api_key):
            return jsonify({"error": "Invalid API key"}), 403
        
        return f(*args, **kwargs)
    
    return decorated_function

@app.route('/api/data')
@require_api_key
def get_data():
    return jsonify({"data": "sensitive information"})
```

### Principle of Least Privilege
- Grant minimum permissions needed
- Use role-based access control (RBAC)
- Regularly audit permissions
- Remove unused access

## Data Protection

### Encryption at Rest
- Use Azure Storage encryption (enabled by default)
- Encrypt sensitive database columns
- Use BitLocker for local development machines

### Encryption in Transit
- Always use HTTPS/TLS
- Enforce TLS 1.2 or higher
- Use certificate pinning for critical APIs

```python
import requests

# ✅ Verify SSL certificates
response = requests.get('https://api.example.com', verify=True)

# ❌ NEVER DO THIS in production
response = requests.get('https://api.example.com', verify=False)
```

### Sensitive Data Handling
```python
import hashlib
import secrets

def hash_password(password: str) -> str:
    """Hash password using secure algorithm."""
    # Use bcrypt, argon2, or scrypt in production
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000  # iterations
    )
    return f"{salt}:{hashed.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    """Verify password against stored hash."""
    salt, hashed = stored_hash.split(':')
    new_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return new_hash.hex() == hashed
```

## Dependency Security

### Dependabot Configuration
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### Regular Updates
- Review Dependabot PRs promptly
- Update dependencies regularly
- Test after updates
- Monitor security advisories

### Vulnerability Scanning
- Use Microsoft Defender for Cloud (Azure)
- Enable GitHub security alerts
- Scan container images
- Review dependency licenses

## Azure-Specific Security

### Managed Identities
```python
# ✅ Use managed identity (no credentials in code)
from azure.identity import ManagedIdentityCredential
from azure.storage.blob import BlobServiceClient

credential = ManagedIdentityCredential()
blob_client = BlobServiceClient(
    account_url="https://mystorageaccount.blob.core.windows.net",
    credential=credential
)
```

### Network Security
- Use Private Endpoints for Azure services
- Implement Network Security Groups (NSGs)
- Enable Azure Firewall for outbound filtering
- Use Application Gateway with WAF

### Resource Locks
```bicep
// Prevent accidental deletion of critical resources
resource lock 'Microsoft.Authorization/locks@2020-05-01' = {
  name: 'DoNotDelete'
  properties: {
    level: 'CanNotDelete'
    notes: 'Prevents accidental deletion of production resources'
  }
}
```

## Security Checklist

### Before Every Commit
- [ ] No secrets in code
- [ ] No hardcoded credentials
- [ ] .gitignore includes sensitive files
- [ ] Input validation on user data
- [ ] Parameterized queries (no SQL injection)
- [ ] HTTPS for all external calls

### Before Every Deployment
- [ ] Secrets stored in Key Vault or secure location
- [ ] Managed identities configured
- [ ] Network security rules in place
- [ ] Encryption enabled
- [ ] Logging and monitoring configured
- [ ] Security scanning passed

### Regular Reviews
- [ ] Audit access permissions
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Rotate secrets and keys
- [ ] Test disaster recovery
- [ ] Review security policies

## Common Vulnerabilities to Avoid

### OWASP Top 10
1. **Broken Access Control** - Enforce authorization checks
2. **Cryptographic Failures** - Use strong encryption
3. **Injection** - Validate and sanitize inputs
4. **Insecure Design** - Security by design, not afterthought
5. **Security Misconfiguration** - Secure defaults, regular audits
6. **Vulnerable Components** - Keep dependencies updated
7. **Authentication Failures** - Strong auth, MFA, session management
8. **Data Integrity Failures** - Verify data integrity
9. **Logging Failures** - Log security events
10. **SSRF** - Validate URLs, use allowlists

## Resources

- [Azure Security Best Practices](https://docs.microsoft.com/azure/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
- [Microsoft Security Development Lifecycle](https://www.microsoft.com/en-us/securityengineering/sdl/)

## Remember

> "Security is not a product, but a process." - Bruce Schneier

- Assume breach mentality
- Defense in depth
- Least privilege always
- Secure by default
- Regular security reviews
- Stay informed about threats
