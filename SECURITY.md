# Security policy

## Supported version

Security fixes target the latest release on the `main` branch.

## Reporting

Use GitHub's private vulnerability reporting for this repository when available. Do not open a public issue containing an active exploit, private data or a reliable bypass.

Include:

- the affected AppBlocks source;
- generated output demonstrating the defect;
- the compiler and Node versions;
- reproduction steps;
- the expected security boundary.

## Compiler boundary

AppBlocks Web escapes authored content and allowlists only HTTP(S), `mailto:`, `tel:`, hash and project-relative URLs. The DSL intentionally provides no raw-HTML or arbitrary-JavaScript block. Generated browser behavior is allowlisted in `src/runtime.js`.

These controls do not provide:

- backend authorization;
- server-side input validation;
- database policy enforcement;
- a deployment Content Security Policy;
- dependency or asset provenance outside this repository;
- protection for conventional code added after compilation.

Treat all network, identity, payment and persistence integrations as separate trust boundaries requiring their own validation and review.
