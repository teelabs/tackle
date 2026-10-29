import type { AuthorizationContext, RoleAssignment } from "./index.js";

/** Consumer-owned callback contract for assignment loading; `DB` is deliberately unconstrained. */
export interface DrizzleAssignmentResolverOptions<DB> { db: DB; loadAssignments: (db: DB, subjectId: string, context?: AuthorizationContext) => RoleAssignment[] | Promise<RoleAssignment[]>; }
/**
 * Creates a schema-agnostic assignment resolver.
 * It opens no connection and defines no migrations; callback failures propagate.
 */
export function createDrizzleAssignmentResolver<DB>(options: DrizzleAssignmentResolverOptions<DB>) {
  return { load(subjectId: string, context?: AuthorizationContext) { return options.loadAssignments(options.db, subjectId, context); } };
}
