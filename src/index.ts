/** A consumer-defined actor and its already-resolved role assignments. */
export interface Subject { id: string; assignments: RoleAssignment[]; attributes?: Record<string, unknown>; }
/** A role assignment resolved by the consumer. `policyVersion` can reject stale data. */
export interface RoleAssignment { role: string; active?: boolean; policyVersion?: string; }
/** The protected entity. Tackle never loads or infers a resource. */
export interface Resource { type: string; id?: string; attributes?: Record<string, unknown>; }
/** Request/environment attributes supplied by the consumer. */
export interface AuthorizationContext { attributes?: Record<string, unknown>; }
/** Trusted input to the synchronous authorization operation. */
export interface AuthorizationInput { subject: Subject; action: string; resource?: Resource; context?: AuthorizationContext; }
/** A synchronous, deterministic, side-effect-free ABAC predicate. */
export type PolicyCondition = (input: AuthorizationInput) => boolean;
/** An allow or deny rule consumed by a role. */
export interface Permission { id: string; action: string; effect: "allow" | "deny"; resourceType?: string; condition?: PolicyCondition; }
/** A consumer-defined bundle of permissions. Role names carry no implicit privilege. */
export interface RoleDefinition { name: string; permissions: readonly Permission[]; }
/** Trusted policy input before it is compiled into an immutable snapshot. */
export interface PolicyDefinition { policyId: string; policyVersion: string; roles: readonly RoleDefinition[]; }
type FrozenRoleDefinition = Readonly<{ name: string; permissions: readonly Readonly<Permission>[] }>;
/** Validated policy metadata and role definitions used for one engine generation. */
export interface PolicySnapshot { readonly policyId: string; readonly policyVersion: string; readonly roles: readonly FrozenRoleDefinition[]; }
/** Structured success result with auditable provenance. */
export interface AllowedDecision { allowed: true; action: string; matchedRoles: string[]; matchedPermissions: string[]; policyId: string; policyVersion: string; }
/** Structured fail-closed result. */
export interface DeniedDecision { allowed: false; action: string; reason: DecisionReason; matchedRoles: string[]; matchedPermissions: string[]; policyId: string; policyVersion: string; }
/** Reasons exposed for operational handling without exposing predicate internals. */
export type DecisionReason = "missing-role" | "missing-permission" | "inactive-assignment" | "condition-failed" | "condition-error" | "resource-mismatch" | "context-mismatch" | "stale-assignment";
/** The result returned by `can`. */
export type AuthorizationDecision = AllowedDecision | DeniedDecision;

/** Thrown when a policy cannot be activated because its definition is malformed. */
export class PolicyValidationError extends Error { readonly issues: string[]; constructor(issues: string[]) { super(`Invalid policy: ${issues.join("; ")}`); this.name = "PolicyValidationError"; this.issues = issues; } }

function cloneSnapshot(definition: PolicyDefinition): PolicySnapshot {
  const roles = definition.roles.map(role => Object.freeze({ ...role, permissions: Object.freeze(role.permissions.map(permission => Object.freeze({ ...permission }))) }));
  return Object.freeze({ policyId: definition.policyId, policyVersion: definition.policyVersion, roles: Object.freeze(roles) });
}

function validate(definition: PolicyDefinition): void {
  const issues: string[] = [];
  if (!definition || typeof definition !== "object") issues.push("definition must be an object");
  if (!definition?.policyId) issues.push("policyId is required");
  if (!definition?.policyVersion) issues.push("policyVersion is required");
  if (!Array.isArray(definition?.roles)) issues.push("roles must be an array");
  const roleNames = new Set<string>();
  for (const role of definition?.roles ?? []) {
    if (!role.name || roleNames.has(role.name)) issues.push(`role name must be unique: ${role.name || "<empty>"}`); else roleNames.add(role.name);
    if (!Array.isArray(role.permissions)) issues.push(`permissions must be an array for role ${role.name}`);
    const permissionIds = new Set<string>();
    for (const permission of role.permissions ?? []) {
      if (!permission.id || permissionIds.has(permission.id)) issues.push(`permission id must be unique within role ${role.name}: ${permission.id || "<empty>"}`); else permissionIds.add(permission.id);
      if (!permission.action) issues.push(`permission action is required: ${role.name}/${permission.id}`);
      if (permission.effect !== "allow" && permission.effect !== "deny") issues.push(`permission effect is invalid: ${role.name}/${permission.id}`);
      if (permission.condition !== undefined && typeof permission.condition !== "function") issues.push(`permission condition must be a function: ${role.name}/${permission.id}`);
      if (permission.condition !== undefined && typeof permission.condition === "function" && permission.condition.constructor.name === "AsyncFunction") issues.push(`permission condition must be synchronous: ${role.name}/${permission.id}`);
    }
  }
  if (issues.length) throw new PolicyValidationError(issues);
}

/**
 * Validates trusted TypeScript policy code and returns an immutable snapshot.
 * Throws `PolicyValidationError` before activation; it never executes conditions.
 */
export function buildPolicy(definition: PolicyDefinition): PolicySnapshot { validate(definition); return cloneSnapshot(definition); }

/** A synchronous engine that evaluates one immutable policy snapshot at a time. */
export interface AuthorizationEngine { can(input: AuthorizationInput): AuthorizationDecision; replace(definition: PolicyDefinition | PolicySnapshot): PolicySnapshot; getSnapshot(): PolicySnapshot; }

function denied(snapshot: PolicySnapshot, input: AuthorizationInput, reason: DecisionReason, roles: string[] = [], permissions: string[] = []): DeniedDecision {
  return { allowed: false, action: input.action, reason, matchedRoles: roles, matchedPermissions: permissions, policyId: snapshot.policyId, policyVersion: snapshot.policyVersion };
}

/**
 * Creates a pure, I/O-free authorization engine. `replace` validates completely then swaps atomically.
 * Assignments, authentication, persistence, sessions, and revocation remain consumer responsibilities.
 */
export function createAuthorizationEngine(initial: PolicySnapshot): AuthorizationEngine {
  validate(initial);
  let snapshot = cloneSnapshot(initial);
  return {
    can(input) {
      const current = snapshot;
      const byName = new Map(current.roles.map(role => [role.name, role]));
      const assignments = input.subject.assignments ?? [];
      if (!assignments.length) return denied(current, input, "missing-role");
      const matchedRoles: string[] = []; const activeRoles: RoleDefinition[] = []; let inactive = false; let stale = false;
      for (const assignment of assignments) {
        const role = byName.get(assignment.role); if (!role) continue;
        matchedRoles.push(role.name);
        if (assignment.policyVersion && assignment.policyVersion !== current.policyVersion) { stale = true; continue; }
        if (assignment.active === false) { inactive = true; continue; }
        activeRoles.push(role);
      }
      if (!activeRoles.length) return denied(current, input, stale ? "stale-assignment" : inactive ? "inactive-assignment" : "missing-role", matchedRoles);
      const matching = activeRoles.flatMap(role => role.permissions.filter(permission => permission.action === input.action));
      const permissionIds = matching.map(permission => permission.id);
      if (!matching.length) return denied(current, input, "missing-permission", matchedRoles);
      const target = matching.filter(permission => permission.resourceType === undefined || permission.resourceType === input.resource?.type);
      if (!target.length) return denied(current, input, "resource-mismatch", matchedRoles, permissionIds);
      const passed: Permission[] = []; let conditionFailure: DecisionReason | undefined;
      for (const permission of target) {
        if (!permission.condition) { passed.push(permission); continue; }
        try { if (permission.condition(input)) passed.push(permission); else conditionFailure = "condition-failed"; }
        catch { conditionFailure = "condition-error"; }
      }
      const passedIds = passed.map(permission => permission.id);
      const denies = passed.filter(permission => permission.effect === "deny");
      const allows = passed.filter(permission => permission.effect === "allow");
      if (denies.length) return denied(current, input, "missing-permission", matchedRoles, [...new Set([...passedIds, ...denies.map(p => p.id)])]);
      if (!allows.length) return denied(current, input, conditionFailure ?? "context-mismatch", matchedRoles, permissionIds);
      return { allowed: true, action: input.action, matchedRoles: [...new Set(matchedRoles)], matchedPermissions: [...new Set(allows.map(permission => permission.id))], policyId: current.policyId, policyVersion: current.policyVersion };
    },
    replace(next) { const validated = buildPolicy(next); snapshot = validated; return validated; },
    getSnapshot() { return snapshot; }
  };
}
