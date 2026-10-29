import { describe, expect, it } from "vitest";
import { createDrizzleAssignmentResolver } from "../src/drizzle.js";
import { can as reactCan, createCan } from "../src/react.js";
import { buildPolicy, createAuthorizationEngine } from "../src/index.js";

describe("adapter contracts", () => {
  it("passes consumer database and subject id to Drizzle callback", async () => { const db = {}; const seen: unknown[] = []; const resolver = createDrizzleAssignmentResolver({ db, loadAssignments: async (value, id) => { seen.push(value, id); return [{ role: "reader" }]; } }); await expect(resolver.load("s")).resolves.toEqual([{ role: "reader" }]); expect(seen).toEqual([db, "s"]); });
  it("provides a presentation decision without changing core authority", () => { const engine = createAuthorizationEngine(buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }] })); expect(reactCan(engine, { id: "s", assignments: [{ role: "reader" }] }, "document.read", { type: "document" }).allowed).toBe(true); });
  it("supports a bound presentation can helper", () => { const engine = createAuthorizationEngine(buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }] })); expect(createCan(engine, { id: "s", assignments: [{ role: "reader" }] })("document.read", { type: "document" }).allowed).toBe(true); });
});
