# Concepts

Audience: engineers integrating authorization. Prerequisites: TypeScript and the README.

`subject` requests access; `action` names an operation; `resource` is protected data; `context` contains request attributes; a `policy` contains rules; a `permission` allows or denies an action; a `role` bundles permissions; an `assignment` attaches a role; a `decision` is the result.

```ts
const decision = engine.can({ subject, action: "document.read", resource: { type: "document" }, context: { attributes: { channel: "web" } } });
console.log(decision.allowed); // true or false
```

An unknown role or action denies. The failure output includes a reason and policy metadata. Tackle owns evaluation; the consumer owns identity, assignments, resources, and enforcement. Tackle deliberately does not interpret domain vocabulary or role names. If `assignments` is empty, the expected output is a denied `missing-role` decision; no fallback allow is attempted.

Failure case: an inactive or stale assignment is denied and identified in `decision.reason`. The consumer owns the assignment source and must refresh it when appropriate.
