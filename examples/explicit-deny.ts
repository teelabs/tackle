import { buildPolicy, createAuthorizationEngine } from "../src/index.js";
const engine = createAuthorizationEngine(buildPolicy({ policyId: "example", policyVersion: "1", roles: [{ name: "editor", permissions: [{ id: "allow", action: "document.update", effect: "allow" }, { id: "deny", action: "document.update", effect: "deny" }] }] }));
console.log(engine.can({ subject: { id: "subject-1", assignments: [{ role: "editor" }] }, action: "document.update" }));
