import { describe, expect, it } from "vitest";
import { buildPolicy, createAuthorizationEngine, PolicyValidationError, type PolicyDefinition } from "../src/index.js";

const allow = (version = "1"): PolicyDefinition => ({ policyId: "app", policyVersion: version, roles: [{ name: "editor", permissions: [{ id: "edit", action: "document.update", effect: "allow" }] }] });
const input = { subject: { id: "s", assignments: [{ role: "editor" }] }, action: "document.update", resource: { type: "document" } };

describe("policy lifecycle and fail closed behavior", () => {
  it("retains the last-known-good snapshot after invalid replacement", () => { const engine = createAuthorizationEngine(buildPolicy(allow())); expect(() => engine.replace({ ...allow(), roles: [{ name: "", permissions: [] }] })).toThrow(PolicyValidationError); expect(engine.getSnapshot().policyVersion).toBe("1"); expect(engine.can(input).allowed).toBe(true); });
  it("rejects stale assignments", () => { const engine = createAuthorizationEngine(buildPolicy(allow("2"))); expect(engine.can({ ...input, subject: { ...input.subject, assignments: [{ role: "editor", policyVersion: "1" }] } })).toMatchObject({ allowed: false, reason: "stale-assignment" }); });
  it("turns predicate exceptions into denial", () => { const policy = allow(); policy.roles[0]!.permissions[0]!.condition = () => { throw new Error("boom"); }; expect(createAuthorizationEngine(buildPolicy(policy)).can(input)).toMatchObject({ allowed: false, reason: "condition-error" }); });
  it("evaluates ownership conditions against trusted resource attributes", () => { const policy = allow(); policy.roles[0]!.permissions[0]!.condition = value => value.resource?.attributes?.ownerId === value.subject.id; const engine = createAuthorizationEngine(buildPolicy(policy)); expect(engine.can(input)).toMatchObject({ allowed: false, reason: "condition-failed" }); expect(engine.can({ ...input, resource: { type: "document", attributes: { ownerId: "s" } } }).allowed).toBe(true); });
  it("keeps replacement atomic for an in-flight decision", () => { const engine = createAuthorizationEngine(buildPolicy(allow())); const before = engine.can(input); engine.replace(allow("2")); expect(before.policyVersion).toBe("1"); expect(engine.can(input).policyVersion).toBe("2"); });
  it("freezes snapshots at runtime", () => { const snapshot = buildPolicy(allow()); expect(Object.isFrozen(snapshot)).toBe(true); expect(Object.isFrozen(snapshot.roles)).toBe(true); expect(Object.isFrozen(snapshot.roles[0]?.permissions)).toBe(true); });
});
