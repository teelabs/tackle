# Express adapter

Audience: Express integrators. Prerequisites: an initialized authorization engine, an authentication layer that attaches a trusted `subject`, and consumer-owned resource/context resolvers.

The adapter translates a core decision into Express middleware behavior. It does not authenticate requests, validate client-provided roles, load data without an injected callback, replace service or repository checks, own sessions, or revoke access.

## Complete route example

```ts
import { can } from "@teelabs/tackle/express";

router.patch(
  "/documents/:id",
  can("document.update", {
    engine,
    resolveResource: loadDocumentForAuthorization,
    resolveContext: resolveRequestContext,
  }),
  updateDocument,
);
```

`loadDocumentForAuthorization` and `resolveRequestContext` are consumer callbacks. They may be asynchronous, and their failures remain application errors. Tackle never turns a resolver failure into an allow.

## HTTP and audit behavior

The adapter uses these outcomes:

- missing `request.subject`: HTTP `401` with `{ "error": "authentication-required" }`;
- denied decision: HTTP `403` with `{ "error": "forbidden" }`;
- allowed decision: `next()` is called.

The denied response is intentionally generic. Tackle does not serialize `reason`, `policyId`, `policyVersion`, matched roles, or matched permissions to an untrusted client. After evaluation, the complete decision is available server-side as `request.tackle.decision` so consumer-owned audit or error handling can record it without exposing policy provenance in the HTTP response:

```ts
const decision = request.tackle?.decision;
if (decision && !decision.allowed) {
  auditAuthorizationFailure({ subjectId: request.subject?.id, decision });
}
```

Place audit handling in the consumer's request/error instrumentation because denied middleware returns the response without calling downstream route handlers.

Expected output is a generic `401` or `403` response for failure, `next()` for an allowed request, and a server-side decision record when the consumer observes `request.tackle.decision`. A browser must not use this adapter as its enforcement boundary; the API and service layers remain authoritative.

## Ownership and failure cases

Tackle owns action evaluation, decision provenance, and HTTP status mapping. The consumer owns authentication, trusted subject construction, resolver implementation, audit storage, service-level checks, repository filtering, session state, revocation, and Express error handling. A missing subject is `401`; a valid subject without permission is `403`; resolver errors are propagated for the consumer to handle.
