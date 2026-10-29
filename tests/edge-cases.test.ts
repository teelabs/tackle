import { describe, expect, it } from "vitest";
import { buildPolicy, createAuthorizationEngine, PolicyValidationError } from "../src/index.js";

describe("decision edge cases", () => {
  it("unions permissions from multiple active assignments", () => {
    const engine = createAuthorizationEngine(buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }, { name: "writer", permissions: [{ id: "write", action: "document.update", effect: "allow" }] }] }));
    const subject = { id: "s", assignments: [{ role: "reader" }, { role: "writer" }] };
    expect(engine.can({ subject, action: "document.update" }).allowed).toBe(true);
    expect(engine.can({ subject, action: "document.read" }).allowed).toBe(true);
  });
  it("reports inactive assignment provenance", () => {
    const engine = createAuthorizationEngine(buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }] }));
    expect(engine.can({ subject: { id: "s", assignments: [{ role: "reader", active: false }] }, action: "document.read" })).toMatchObject({ allowed: false, reason: "inactive-assignment", matchedRoles: ["reader"] });
  });
  it("evaluates context conditions and reports resource mismatch", () => {
    const engine = createAuthorizationEngine(buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "web-read", action: "document.read", effect: "allow", resourceType: "document", condition: input => input.context?.attributes?.channel === "web" }] }] }));
    const subject = { id: "s", assignments: [{ role: "reader" }] };
    expect(engine.can({ subject, action: "document.read", resource: { type: "image" }, context: { attributes: { channel: "web" } } })).toMatchObject({ allowed: false, reason: "resource-mismatch" });
    expect(engine.can({ subject, action: "document.read", resource: { type: "document" }, context: { attributes: { channel: "web" } } }).allowed).toBe(true);
  });
  it("rejects duplicate roles and permission ids before activation", () => {
    expect(() => buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }, { id: "read", action: "document.read", effect: "allow" }] }, { name: "reader", permissions: [] }] })).toThrow(PolicyValidationError);
  });
});
