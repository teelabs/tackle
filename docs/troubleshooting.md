# Troubleshooting

Audience: integrators diagnosing denials. Prerequisites: a decision object.

```ts
if (!decision.allowed) console.log(decision.reason, decision.matchedRoles, decision.matchedPermissions);
```

`missing-role` means no active known assignment; `inactive-assignment` and `stale-assignment` identify assignment state; `missing-permission` means no allow survived (including explicit deny); `resource-mismatch` means the target type did not match; condition failures and exceptions are explicit. Check policy version and trusted inputs first. Tackle does not query missing data or repair assignments. A malformed replacement throws and leaves the old snapshot active.

Expected output for a valid match is `allowed: true` with matched roles and permissions. Expected failure output is `allowed: false` with a reason and policy metadata; consumers own the next operational action.
