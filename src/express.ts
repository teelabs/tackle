import type { AuthorizationContext, AuthorizationDecision, AuthorizationEngine, Resource, Subject } from "./index.js";

/** Minimal request shape required by the Express adapter; Express remains an optional peer. */
export interface ExpressLikeRequest { subject?: Subject; params?: Record<string, string | undefined>; tackle?: { decision?: AuthorizationDecision }; }
/** Minimal response shape required by the adapter. */
export interface ExpressLikeResponse { status(code: number): ExpressLikeResponse; json(body: unknown): void; }
/** The continuation callback supplied by Express. */
export type ExpressNext = (error?: unknown) => void;
/** Consumer-supplied engine and trusted resolvers used by the middleware. */
export interface ExpressCanOptions { engine: AuthorizationEngine; resolveResource?: (request: ExpressLikeRequest) => Resource | Promise<Resource | undefined> | undefined; resolveContext?: (request: ExpressLikeRequest) => AuthorizationContext | Promise<AuthorizationContext | undefined> | undefined; }

/**
 * Creates Express-compatible middleware. It maps missing subjects to 401 and denied decisions to 403.
 * The adapter does not authenticate, trust client roles, query databases, or replace service checks.
 */
export function can(action: string, options: ExpressCanOptions) {
  return async (request: ExpressLikeRequest, response: ExpressLikeResponse, next: ExpressNext): Promise<void> => {
    if (!request.subject) { response.status(401).json({ error: "authentication-required" }); return; }
    const [resource, context] = await Promise.all([options.resolveResource?.(request), options.resolveContext?.(request)]);
    const result = options.engine.can({ subject: request.subject, action, ...(resource ? { resource } : {}), ...(context ? { context } : {}) });
    request.tackle = { decision: result };
    if (!result.allowed) { response.status(403).json({ error: "forbidden", decision: result }); return; }
    next();
  };
}
