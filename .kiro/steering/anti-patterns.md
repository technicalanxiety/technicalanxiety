# Anti-Patterns to Avoid

## Code
- Over-engineering: No complexity for theoretical future needs. YAGNI applies.
- Poor docs: No cryptic names, missing READMEs, or unexplained complex logic
- Unclear code: No clever one-liners sacrificing readability
- Dependency hell: No unnecessary dependencies, outdated packages, or circular references
- Configuration chaos: No environment-specific hardcoding, missing config validation, or scattered settings
- Error handling gaps: No silent failures, generic error messages, or missing observability

## Azure/Cloud
- Security: Never hardcode secrets, overly permissive roles, or skip encryption
- Cost: No over-provisioning, unused resources, or unnecessary cross-region transfers
- Governance: No deployments without tags, inconsistent naming, or manual processes
- Monitoring blind spots: No deployments without logging, missing alerts, or untracked SLAs
- Data exposure: No public storage accounts, missing network segmentation, or unencrypted transit
- Resource sprawl: No orphaned resources, inconsistent environments, or missing lifecycle policies

## DevOps/Operations
- Manual toil: No manual deployments, undocumented processes, or single points of failure
- Pipeline fragility: No untested deployments, missing rollback plans, or environment drift
- Access chaos: No shared accounts, permanent elevated access, or missing audit trails

## Architecture
- Tight coupling: No direct database access from UI, shared state without contracts, or monolithic deployments
- Single points of failure: No missing redundancy, untested disaster recovery, or critical path dependencies
- Performance afterthoughts: No missing caching strategy, unoptimized queries, or ignored bottlenecks

## Values
Simplicity > complexity | Clarity > cleverness | 
Practical > theoretical | Maintainable > "perfect"