# Security model

Audience: security reviewers. Prerequisites: an understanding of the consumer trust boundary.

```ts
const decision = engine.can(input);
if (!decision.allowed) audit({ reason: decision.reason, policy: decision.policyVersion });
```

The core is fail-closed and deny-overrides-allow. It assumes its input and policy code are trusted. It does not authenticate, sanitize client roles, limit predicate runtime, prevent UI tampering, revoke sessions, or enforce repository filtering. Consumers own those controls. Predicate exceptions are explicit denial, not an error fallback to allow. The expected failure output is a denied decision with metadata.

Failure case: a browser-hidden button is not security; a forged request must still be denied by the consumer API. Tackle owns only the decision calculation and provenance.
