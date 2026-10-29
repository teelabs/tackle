import { buildPolicy, createAuthorizationEngine } from "../src/index.js";
const engine = createAuthorizationEngine(buildPolicy({ policyId: "example", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow", condition: () => { throw new Error("bug"); } }] }] }));
console.log(engine.can({ subject: { id: "subject-1", assignments: [{ role: "reader" }] }, action: "document.read" })); // condition-error denial
