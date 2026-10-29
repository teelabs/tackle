import { buildPolicy, createAuthorizationEngine } from "../src/index.js";
const engine = createAuthorizationEngine(buildPolicy({ policyId: "example", policyVersion: "1", roles: [{ name: "editor", permissions: [{ id: "edit-document", action: "document.update", effect: "allow" }] }] }));
console.log(engine.can({ subject: { id: "subject-1", assignments: [{ role: "editor" }] }, action: "document.update", resource: { type: "document", id: "document-1" } }));
