# Policy lifecycle

Audience: operators and integrators. Prerequisites: a built snapshot.

```ts
const next = buildPolicy({ policyId: "app", policyVersion: "2", roles });
engine.replace(next);
console.log(engine.getSnapshot().policyVersion); // 2
```

Snapshots are immutable and metadata is explicit. Replacement validates the complete snapshot, then atomically activates it; invalid replacement preserves last-known-good. In-flight `can` calls use one snapshot. Policy changes are distinct from assignment, subject, and resource changes. Tackle owns snapshot state, not polling, deployment, assignment reload, or session revocation. Replacement errors are `PolicyValidationError`.

Expected output after the example is policy version `2`; an invalid replacement instead throws and leaves version `1` active. The consumer owns orchestration and decides when to reload assignments.
