# Security follow-up — October 4, 2026

## Confirmed findings

- The published preview repository is static HTML/CSS/JavaScript, with no Node package manifest or deployed Next.js server. Ordering is disabled; no checkout personal data is persisted by the cart storage code.
- Its tracked files passed the limited credential-pattern/file scan. This is not proof that no secret has ever been exposed, and Git history was not scanned.
- Google Fonts remains an external request. Privacy/provider review must account for external services on the final production site. No analytics or payment integration was added in this work.
- The separate local prototype at `site/keep-it-stylish` declares Next.js 14.2.0 and eslint-config-next 14.2.0. A package-lock-only npm audit returned 20 affected dependency packages: 1 critical, 17 high, 1 moderate and 1 low. These are package findings, not 20 demonstrated exploitable paths on the published preview. Runtime exposure depends on deployment and feature use.

## Prototype disposition before any deployment

Next.js 14 is listed as unsupported in the [official support policy](https://nextjs.org/support-policy). The [Windows server advisory](https://github.com/advisories/GHSA-p293-qw3h-jr36) includes this installed version in its affected range. The audit's suggested 14.2.35 update is not sufficient evidence that every advisory is fixed; individual advisory patched ranges must be checked.

Keep this prototype out of production. If custom Next.js commerce is selected, migrate to a currently supported, patched release and compatible tooling, build/test it, re-run the full and production-only dependency audits, and reassess each remaining finding. If a managed platform is selected, archive the prototype as a historical design reference rather than deploying it. No dependency upgrade or archive was performed here because the prototype's role is undecided. The static storefront remains the published source.

## Needs verification on the chosen commerce platform

Admin MFA/roles, secret management and rotation, server-authoritative prices/stock/tax, webhook signature/replay handling, fraud controls, rate limits, error/log redaction, security headers/CSP, backup recovery, retention/deletion and payment-provider controls. Issue #16 remains open. Do not treat frontend tests or a clean static scan as completion of these production requirements.
