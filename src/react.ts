import type { AuthorizationDecision, AuthorizationEngine, Resource, Subject } from "./index.js";

/**
 * Performs a presentation-only authorization check.
 * The API remains the enforcement boundary and the helper performs no I/O.
 */
export function can(engine: AuthorizationEngine, subject: Subject, action: string, resource?: Resource): AuthorizationDecision {
  return engine.can({ subject, action, ...(resource ? { resource } : {}) });
}
/**
 * Binds a subject and engine for concise presentation checks such as `can("document.update", resource)`.
 * It is not an enforcement boundary and performs no authentication or persistence.
 */
export function createCan(engine: AuthorizationEngine, subject: Subject) {
  return (action: string, resource?: Resource): AuthorizationDecision => can(engine, subject, action, resource);
}
/**
 * Returns a presentation decision whenever subject or policy state changes.
 * Consumers should call it from their framework hook or render lifecycle.
 */
export function useCan(engine: AuthorizationEngine, subject: Subject, action: string, resource?: Resource): AuthorizationDecision {
  return can(engine, subject, action, resource);
}
