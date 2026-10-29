# Versioning

Audience: maintainers and release owners. Prerequisites: the changelog and API contract.

The first release is experimental `0.1.0`. Policy semantics, decision reasons, and public exports require a changelog entry and SemVer classification. Before wider reuse require green CI, reviewed API, golden vectors, adversarial policy and adapter tests, complete boundary documentation, runnable examples, and tarball inspection. Do not describe authorization semantics as stable until a deliberate `1.0.0` gate. Invalid policy and denied decisions are expected runtime outcomes; malformed package builds are release failures.

Expected release output is a reproducible tarball with the documented version. A failed gate blocks release; the consumer owns deployment approval and compatibility decisions.
