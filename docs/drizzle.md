# Drizzle adapter

Audience: database integrators. Prerequisites: a consumer-owned Drizzle database and query.

```ts
const resolver = createDrizzleAssignmentResolver({ db, loadAssignments: async (db, subjectId, context) => applicationQuery(db, subjectId, context) });
const assignments = await resolver.load("subject-1");
```

The callback receives the consumer database, subject id, and optional context. Tackle defines no table, migration, foreign key, transaction, administrator rule, audit write, connection, or session invalidation. Callback errors propagate. The consumer owns schema and assignment lifecycle; Tackle only translates the returned `RoleAssignment[]` contract.

Expected output is the callback's assignment array. Failure case: a rejected callback propagates to the consumer; Tackle does not silently grant access or retry an unknown query.
