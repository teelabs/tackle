# Integration boundaries

Audience: architects. Prerequisites: the core concepts.

```text
consumer authentication -> trusted subject/resource/context -> Tackle can -> consumer API response/audit
```

Tackle owns policy validation, synchronous evaluation, decision provenance, and snapshot replacement. Adapters own framework translation. Consumers own authentication, data loading, persistence, repository filtering, sessions, revocation, audit storage, orchestration, and deployment. A missing callback or untrusted client role is not an implicit allow; it is a consumer integration defect or denial.

Expected output is a decision handed to the consumer enforcement layer. Failure cases remain explicit denials or propagated resolver errors; Tackle deliberately does not cross the boundary to repair them.
