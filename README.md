# Keep It Stylish storefront preview

This repository contains the static storefront currently used for the public preview. `index.html`, `assets/storefront.js`, and `assets/storefront.css` are the source for this change. The separate local Next.js prototype is not deployed by this repository and has not received these changes.

Online payments remain disabled. This is not a production commerce backend. Before accepting orders, move to suitable commerce hosting and complete the critical tasks on the [launch board](https://github.com/users/sahilkaila21/projects/4).

## Local preview

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Product and policy hash links restore the appropriate view and support browser history. They are an interim preview improvement; crawlable production product routes remain part of issue #20.

## Checks

```sh
node --test tests/storefront.test.cjs
node --check assets/storefront.js
```

The tests cover untrusted/stale cart storage, catalog-derived restored prices, invalid variants, bounded quantities, unavailable storage, data minimization, checkout name/address validation, and asset existence.

## Current behavior

- Contact, custom design and order assistance use clearly labeled email links. No message is sent by the website.
- Simulated accounts, subscriptions, tracking emails and request confirmations are removed.
- Cart product selections persist in browser storage for up to 30 days since the last save. No checkout personal data is saved there. Storage failure does not prevent browsing.
- Product thumbnails/swatches and cards are keyboard controls. Checkout labels/errors are associated, menus contain keyboard focus, and reduced-motion preferences are respected.
- Shared support/policy footer and pre-launch notices remain visible throughout the storefront.
- WebP product images have 640px/1280px variants; original reference assets are preserved.

## Remaining launch work

Actual garment facts, stock counts, business identity, support mailbox ownership, taxes, delivery rates, legal policies and payment-provider setup require verification. No claim of legal compliance or full accessibility certification is made by this change. Real-device testing and measured performance budgets remain open.

See [launch inputs](docs/launch-inputs.md) for decisions required next.

## Preparation completed before the platform decision

- Enlarged product gallery supports image navigation, zoom and Escape; size selection survives visits to the size guide during the session.
- Quantity changes preserve keyboard focus. Cart changes synchronize across tabs; unavailable saved selections are reported. This browser preview does not reserve stock or resolve simultaneous edits transactionally.
- Tests now check script syntax, navigation targets, duplicate static IDs, label references and image size budgets as well as cart behavior.
- [Operations playbook](docs/operations-playbook.md): receiving, packing, dispatch, support, returns, refunds and incident rehearsal.
- [Product workbook](docs/product-workbook.md): six proposed SKUs, stock, measurement and photography inputs.
- [Pricing workbook](docs/pricing-workbook.md): cost inputs, contribution formulas and discount scenarios.
- [Marketing drafts](docs/marketing-drafts.md): product, SEO, social and email copy with publication gates.
- [Verification record](docs/verification.md): completed checks and remaining production/device checks.

The worksheets are Markdown documents that can be reviewed in GitHub. They contain no invented business or supplier records.
