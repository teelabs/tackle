import { buildPolicy, createAuthorizationEngine } from "../src/index.js";
const roles = [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" as const }] }];
const engine = createAuthorizationEngine(buildPolicy({ policyId: "example", policyVersion: "1", roles }));
console.log(engine.can({ subject: { id: "subject-1", assignments: [{ role: "reader" }, { role: "reader", active: false }] }, action: "document.read" }));
try { engine.replace({ policyId: "example", policyVersion: "2", roles: [{ name: "", permissions: [] }] }); } catch (error) { console.log(error instanceof Error ? error.name : error); }
console.log(engine.getSnapshot().policyVersion); // 1: last-known-good remains active
