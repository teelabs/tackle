import { describe, expect, it } from "vitest";
import { buildPolicy, createAuthorizationEngine, type AuthorizationInput } from "../src/index.js";

const input: AuthorizationInput = { subject: { id: "s-1", assignments: [{ role: "editor" }] }, action: "document.update", resource: { type: "document", id: "d-1" } };

describe("authorization decisions", () => {
  it("allows an active permission and preserves provenance", () => {
    const snapshot = buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "editor", permissions: [{ id: "edit", action: "document.update", effect: "allow" }] }] });
    expect(createAuthorizationEngine(snapshot).can(input)).toEqual({ allowed: true, action: "document.update", matchedRoles: ["editor"], matchedPermissions: ["edit"], policyId: "app", policyVersion: "1" });
  });
  it("denies when an explicit deny also matches", () => {
    const snapshot = buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "editor", permissions: [{ id: "edit", action: "document.update", effect: "allow" }, { id: "blocked", action: "document.update", effect: "deny" }] }] });
    expect(createAuthorizationEngine(snapshot).can(input)).toMatchObject({ allowed: false, reason: "missing-permission", matchedPermissions: ["edit", "blocked"] });
  });
});
