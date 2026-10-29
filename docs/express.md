# Express adapter

Audience: Express integrators. Prerequisites: an engine and consumer resolvers.

```ts
router.patch("/documents/:id", can("document.update", { engine, resolveResource: loadDocumentForAuthorization, resolveContext: resolveRequestContext }), updateDocument);
```

The middleware resolves only through injected callbacks, attaches `request.tackle.decision`, returns 401 for missing subject and 403 for denial, and calls `next` for allow. Resolver failure is an application error. Tackle does not authenticate, trust client roles, query without a callback, replace service/repository checks, own sessions, or revoke access. The callback and API remain consumer-owned.

Expected output is `next()` for an allowed subject, HTTP 401 without a subject, and HTTP 403 for a denied subject. The consumer owns Express authentication and resolver error handling.
