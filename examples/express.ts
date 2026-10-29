import { can } from "../src/express.js";
import { buildPolicy, createAuthorizationEngine } from "../src/index.js";
const engine = createAuthorizationEngine(buildPolicy({ policyId: "example", policyVersion: "1", roles: [{ name: "reader", permissions: [{ id: "read", action: "document.read", effect: "allow" }] }] }));
const response = { status(code: number) { console.log(code); return this; }, json(body: unknown) { console.log(body); } };
await can("document.read", { engine })({ subject: { id: "subject-1", assignments: [{ role: "reader" }] } }, response, () => console.log("next"));
