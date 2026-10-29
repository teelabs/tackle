# Security model

Tackle fails closed for missing roles, missing permissions, inactive or stale assignments, target mismatches, failed conditions, and condition exceptions. It does not authenticate subjects, validate caller provenance, enforce predicate CPU limits, secure a browser, revoke sessions, filter repository queries, or protect a database. Consumers must resolve trusted inputs, keep predicates bounded, enforce API checks, and own audit and revocation. Report suspected vulnerabilities privately to the package maintainers; do not include credentials or private policy data in issues.
