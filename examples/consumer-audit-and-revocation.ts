import { buildPolicy, createAuthorizationEngine } from "../src/index.js";
const engine = createAuthorizationEngine(buildPolicy({ policyId: "example", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }] }));
const subject = { id: "subject-1", assignments: [{ role: "reader" }] };
const decision = engine.can({ subject, action: "document.read", resource: { type: "document" } });
console.log(decision);
// The application, not Tackle, revokes sessions and persists this decision in its audit system.
