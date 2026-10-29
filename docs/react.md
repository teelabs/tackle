# React adapter

Audience: UI authors. Prerequisites: a subject and engine.

```tsx
const can = createCan(engine, subject);
const decision = can("document.update", document);
return decision.allowed ? <EditButton /> : null;
```

Recompute when subject or policy state changes. A denied decision hides presentation only; a forged browser can still call an API. Tackle owns the same core evaluation; consumers own React state, loading/error UI, and server enforcement. There is no implicit browser security. Invalid or denied results remain decisions rather than thrown errors.

Expected output is an edit button for an allowed decision and no button for denial. Failure case: stale UI state must be corrected by the consumer when subject or policy metadata changes.
