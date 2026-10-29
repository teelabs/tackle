import { createDrizzleAssignmentResolver } from "../src/drizzle.js";
const resolver = createDrizzleAssignmentResolver({ db: { name: "consumer-db" }, loadAssignments: async (db, subjectId) => [{ role: subjectId === "subject-1" ? "reader" : "none" }] });
console.log(await resolver.load("subject-1")); // consumer-owned callback and schema
