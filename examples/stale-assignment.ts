import { buildPolicy, createAuthorizationEngine } from "../src/index.js";
const engine = createAuthorizationEngine(buildPolicy({ policyId: "example", policyVersion: "2", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }] }));
console.log(engine.can({ subject: { id: "subject-1", assignments: [{ role: "reader", policyVersion: "1" }] }, action: "document.read" })); // stale-assignment denial
