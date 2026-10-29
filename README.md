# Tackle

`@teelabs/tackle` is an experimental, framework-agnostic TypeScript authorization engine for RBAC and ABAC. Its primary operation is `can`: it evaluates trusted subject, action, resource, and context input against an immutable policy snapshot.

Tackle is not an authentication system, identity provider, session store, database layer, tenant model, policy DSL, remote PDP, HTTP server, or UI security boundary. The consumer resolves trusted input, owns assignment persistence and revocation, and performs authoritative API checks.

## Five-minute quickstart

```bash
npm install @teelabs/tackle
```

```ts
import { buildPolicy, createAuthorizationEngine } from "@teelabs/tackle";

const engine = createAuthorizationEngine(buildPolicy({
  policyId: "application-access",
  policyVersion: "2026.01",
  roles: [{ name: "editor", permissions: [{ id: "document-update", action: "document.update", effect: "allow" }] }],
}));

const decision = engine.can({
  subject: { id: "subject-1", assignments: [{ role: "editor" }] },
  action: "document.update",
  resource: { type: "document", id: "document-1" },
});
console.log(decision.allowed); // true
```

Role names have no implicit privilege. Explicit deny rules override allows:

```ts
{ name: "restricted", permissions: [
  { id: "allow-edit", action: "document.update", effect: "allow" },
  { id: "deny-edit", action: "document.update", effect: "deny" },
] }
```

ABAC conditions are trusted synchronous TypeScript predicates. Exceptions become `condition-error` denial. Conditions must be bounded and side-effect-free.

## Policy replacement

```ts
engine.replace(buildPolicy({ policyId: "application-access", policyVersion: "2026.02", roles }));
```

The complete replacement validates before an atomic swap; invalid replacement leaves the last-known-good snapshot active. Policy polling and assignment/session changes belong to the consumer.

## Integrations

- [Express middleware](docs/express.md) maps missing subjects to 401 and denials to 403.
- [React presentation checks](docs/react.md) hide UI only; the API remains authoritative.
- [Drizzle callbacks](docs/drizzle.md) translate consumer-owned query results without assuming a schema.

See [concepts](docs/concepts.md), [core API](docs/core-api.md), [policy authoring](docs/policy-authoring.md), [security model](docs/security-model.md), and [integration boundaries](docs/integration-boundaries.md). Run the examples with `npx tsx examples/minimal-rbac.ts`.
