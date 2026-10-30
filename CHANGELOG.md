# Changelog

## [Unreleased]

## [0.1.1] - 2026-10-29

### Security

- Keep denied Express responses generic so authorization provenance is not exposed to clients.

### Changed

- Document the server-side audit decision boundary and add agent guidance for preserving it.
- Make the npm release workflow idempotent for the one-time manually bootstrapped `0.1.0` package.

## [0.1.0] - 2026-10-30

### Added

- Experimental initial release of the agnostic synchronous RBAC/ABAC engine and schema-free adapters.
- An OIDC-based npm publishing workflow triggered by a published GitHub Release, with tag/version validation and provenance support.

### Changed

- Modernized development and release tooling around pnpm, tsdown, Node.js 24/26 CI coverage, and meaningful TypeScript ESLint rules.

### Security

- Updated Vitest to 4.1.12 to address the file-read and code-injection advisories affecting older Vitest releases.
- Public authorization semantics are not stable until a deliberate 1.0.0 gate.
