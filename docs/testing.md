# Testing

Audience: maintainers and consumers. Prerequisites: Node.js 20+.

```bash
pnpm run lint && pnpm run typecheck && pnpm test && pnpm run build && pnpm run docs:check && pnpm run pack:dry-run
```

The package tests golden decisions, deny precedence, stale assignments, predicate errors, lifecycle retention, adapter callbacks, and examples. Consumers should test resolver contracts, API 401/403 mapping, repository filtering, revocation, and their own policy predicates. A green core suite does not prove authentication or database security; those remain consumer responsibilities.

Expected CI output is zero failures. Failure cases should be added as regression vectors before changing semantics; Tackle owns its test contracts while consumers own integration and production tests.
