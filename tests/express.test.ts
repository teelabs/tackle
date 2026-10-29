import { describe, expect, it, vi } from "vitest";
import { can } from "../src/express.js";
import { buildPolicy, createAuthorizationEngine } from "../src/index.js";

const engine = createAuthorizationEngine(buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }] }));
const response = () => { const value = { code: 0, body: undefined as unknown }; return { value, api: { status(code: number) { value.code = code; return this; }, json(body: unknown) { value.body = body; } } }; };

describe("Express adapter", () => {
  it("returns 401 when the consumer has no subject", async () => { const result = response(); await can("document.read", { engine })({}, result.api, vi.fn()); expect(result.value.code).toBe(401); });
  it("returns 403 for a denied decision", async () => { const result = response(); await can("document.read", { engine })({ subject: { id: "s", assignments: [] } }, result.api, vi.fn()); expect(result.value.code).toBe(403); });
  it("calls next for an allowed decision", async () => { const next = vi.fn(); await can("document.read", { engine })({ subject: { id: "s", assignments: [{ role: "reader" }] } }, response().api, next); expect(next).toHaveBeenCalledOnce(); });
});
