# Policy authoring

Audience: policy authors. Prerequisites: trusted TypeScript deployment code.

```ts
const policy = buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "owner", permissions: [{ id: "edit-own", action: "document.update", effect: "allow", resourceType: "document", condition: input => input.resource?.attributes?.ownerId === input.subject.id }] }] });
```

Conditions must be synchronous, deterministic, explicit, bounded, and side-effect-free. They must not use network, database, filesystem, or session state. Invalid definitions throw before activation; exceptions during evaluation deny. Tackle owns validation and evaluation; consumers own code review and deployment. Tackle deliberately provides no DSL or serialized predicate execution.

Expected owner input returns `allowed: true`; a non-owner returns `condition-failed`, and an async or malformed predicate fails policy validation. The consumer owns policy review and release.
