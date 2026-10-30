# Versioning

Audience: maintainers and release owners. Prerequisites: the changelog and API contract.

The first release is experimental `0.1.0`. Policy semantics, decision reasons, and public exports require a changelog entry and SemVer classification. Before wider reuse require green CI, reviewed API, golden vectors, adversarial policy and adapter tests, complete boundary documentation, runnable examples, and tarball inspection. Do not describe authorization semantics as stable until a deliberate `1.0.0` gate. Invalid policy and denied decisions are expected runtime outcomes; malformed package builds are release failures.

Expected release output is a reproducible tarball with the documented version. A failed gate blocks release; the consumer owns deployment approval and compatibility decisions.

## npm publishing

The package is published by `.github/workflows/publish.yml` using npm trusted publishing through GitHub Actions OIDC. Configure the npm package's trusted publisher as organization `teelabs`, repository `tackle`, workflow filename `publish.yml`, and no environment name unless a protected GitHub environment is deliberately added.

Prerequisites:

- the package exists on npm as public `@teelabs/tackle`;
- the npm trusted publisher allows direct `npm publish` for this workflow;
- the repository's release rules permit the tag and the required checks are green.

To publish, update `package.json` and `CHANGELOG.md`, run the documented verification commands, merge the change to `main`, and create an annotated tag whose version exactly matches `package.json`, for example `v0.1.0`. The workflow rejects mismatched tags and does not use an `NPM_TOKEN` secret. npm generates provenance automatically for trusted publishing from this public GitHub repository.

The workflow also supports manual dispatch when given an existing version tag. Manual dispatch does not create a version or tag; it only republishes the selected tag and is subject to npm's duplicate-version rejection.
