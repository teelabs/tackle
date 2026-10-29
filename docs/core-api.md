# Core API

Audience: library integrators. Prerequisites: the package and trusted input.

```ts
const snapshot = buildPolicy({ policyId: "app", policyVersion: "1", roles: [] });
const engine = createAuthorizationEngine(snapshot);
const decision = engine.can({ subject: { id: "s", assignments: [] }, action: "document.read" });
console.log(decision.reason); // missing-role
```

`buildPolicy` throws `PolicyValidationError` for malformed definitions. `can` is synchronous and never performs I/O. `replace` validates before swapping. A predicate exception yields `condition-error`; all other unmatched cases deny. Tackle owns types and decisions; consumers own trusted input and response handling. Public exports are TSDoc-documented in `src/index.ts`. An invalid definition throws; a valid but unauthorized request returns a denial rather than throwing.

Expected output is always an `AuthorizationDecision` with action, provenance, policy id, and policy version. Tackle deliberately does not load missing subjects, resources, or context.
