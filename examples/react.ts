import { createCan } from "../src/react.js";
import { buildPolicy, createAuthorizationEngine } from "../src/index.js";
const engine = createAuthorizationEngine(buildPolicy({ policyId: "example", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }] }));
const decision = createCan(engine, { id: "subject-1", assignments: [{ role: "reader" }] })("document.read", { type: "document" });
console.log(decision.allowed); // presentation only; the API still enforces access
