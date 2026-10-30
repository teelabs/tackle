# Contributing agents

Read `README.md` and the relevant guide before changing public APIs. For Express adapter work, read `docs/express.md` before editing `src/express.ts` or its tests. TypeScript types, tests, and runnable examples are executable contracts. Never invent consumer role, resource, or action names; never add persistence assumptions to the core; never authenticate or authorize from client-provided roles; never add fallback allow behavior.

Preserve deny-overrides-allow, last-known-good atomic policy replacement, and predicate-error denial. State assumptions explicitly. Public API changes require examples, tests, TSDoc, and SemVer/changelog classification. Distinguish core, adapter, and consumer responsibilities, and do not claim guarantees Tackle cannot enforce.

Express security boundary: denied HTTP responses stay generic (`{ error: "forbidden" }`). Keep the full `AuthorizationDecision` on `request.tackle.decision` for consumer-owned server-side audit or error handling, and never serialize its reason, policy metadata, matched roles, or matched permissions to an untrusted client. Missing subjects remain `401`, denied decisions remain `403`, and allowed requests call `next()`. Any change to this boundary requires updated documentation and executable tests.

Before handoff run `pnpm run lint`, `pnpm run typecheck`, `pnpm test`, `pnpm run build`, `pnpm run docs:check`, and `pnpm run pack:dry-run`. Do not publish, release, or modify external repositories without explicit authorization.

## Required change checklist

1. Does the change affect the core API?
2. Does it affect policy semantics?
3. Does it affect decision reasons or precedence?
4. Does it affect adapter behavior?
5. Does it affect policy lifecycle?
6. Does it require a documentation example?
7. Does it require a SemVer classification?
8. Which responsibility boundary changed?
