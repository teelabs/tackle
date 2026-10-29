import { expect, it } from "vitest";
import { buildPolicy, PolicyValidationError, type PolicyCondition } from "../src/index.js";

it("rejects asynchronous policy predicates before activation", () => {
  expect(() => buildPolicy({ policyId: "app", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow", condition: (async () => true) as unknown as PolicyCondition }] }] })).toThrow(PolicyValidationError);
});
