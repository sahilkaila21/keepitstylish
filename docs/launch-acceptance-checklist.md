# U.S. launch acceptance checklist — October 5, 2026

The public site is a three-dress preview with ordering disabled. Checked items below apply only to verified preview work. The store is not ready to accept real orders. Use the linked GitHub issues as the work queue; preserve actual evidence privately when it contains customer/business records.

## Preview work verified

- [x] Three catalog entries with shared product data, USD preview prices and size options.
- [x] Centered model photos and multiple gallery views; AI previews disclosed.
- [x] About us links to the full Manju story.
- [x] Bag persistence/catalog validation, search/history, empty states and missing-link recovery checked.
- [x] Mobile layout, keyboard focus and checkout field behavior checked within the recorded scope.
- [x] Customer-support drafts, operations/pricing/product worksheets and SEO/analytics specifications prepared.
- [x] Automated storefront/release checks and release/rollback instructions added.

These do not verify garment facts, stock, legal compliance, live orders or actual delivery.

## Critical before accepting orders

| Gate | Evidence needed | GitHub |
|---|---|---|
| Seller and locations | Verified seller, business jurisdiction, ship-from and return destinations | [L01](https://github.com/sahilkaila21/keepitstylish/issues/1) |
| Commerce platform | Chosen platform/provider, approved settlement setup, production domain/hosting and responsible admin | [L02](https://github.com/sahilkaila21/keepitstylish/issues/2) |
| Inventory | Nine proposed S/M/L variants reconciled to inspected stock; unique SKU mapping and unavailable rules | [L03](https://github.com/sahilkaila21/keepitstylish/issues/3) |
| Garment compliance | Applicable labeling, safety and import records reviewed with qualified help where required | [L04](https://github.com/sahilkaila21/keepitstylish/issues/4) |
| Product evidence | Actual photos, fiber/care/origin, fit/construction and measured sizes for every dress | [L05](https://github.com/sahilkaila21/keepitstylish/issues/5) |
| Viable pricing | Approved price, costs, margins and permitted promotions | [L06](https://github.com/sahilkaila21/keepitstylish/issues/6) |
| Fulfillment | Tested packed weights, rates, destinations, handling/delivery estimates, tracking and returns workflow | [L07](https://github.com/sahilkaila21/keepitstylish/issues/7) |
| Taxes | Qualified nexus/registration review and verified platform calculation/collection setup | [L08](https://github.com/sahilkaila21/keepitstylish/issues/8) |
| Payments/orders | Verified total before payment; one durable order per paid transaction; reliable failure/retry handling | [L09](https://github.com/sahilkaila21/keepitstylish/issues/9) |
| Stock/refunds | Server-authoritative inventory, last-unit protection and provider-backed refunds | [L10](https://github.com/sahilkaila21/keepitstylish/issues/10) |
| Accurate public actions | Recheck truthful contact/account/subscription/order actions on the chosen platform | [L11](https://github.com/sahilkaila21/keepitstylish/issues/11) |
| Policies | Approved privacy, terms, shipping and return/refund policies matching actual operations | [L12](https://github.com/sahilkaila21/keepitstylish/issues/12) |
| Emails/support | Verified inbox/sender, delivered event-based emails, response owner and escalation | [L13](https://github.com/sahilkaila21/keepitstylish/issues/13) |
| Operations | Packing, dispatch, return, refund and reconciliation rehearsal with assigned owners | [L14](https://github.com/sahilkaila21/keepitstylish/issues/14) |
| Accessibility | Actual device, screen-reader, zoom/contrast and production purchase-flow verification | [L15](https://github.com/sahilkaila21/keepitstylish/issues/15) |
| Security | Platform access/MFA, secrets, webhooks, fraud/rate controls and backup recovery; resolve/retire old prototype | [L16](https://github.com/sahilkaila21/keepitstylish/issues/16) |
| Final acceptance | All scenarios below pass; merchant completes a controlled live purchase/refund before opening orders | [L17](https://github.com/sahilkaila21/keepitstylish/issues/17) |

Every critical gate above remains open for production unless its recorded evidence proves otherwise. Legal/tax reviewers should use actual facts; this checklist is not their professional advice.

## Production acceptance scenarios — all Needs verification

- [ ] Browse each dress, choose its real variant and confirm correct SKU, price and stock in bag/checkout.
- [ ] Reload/back/forward and separate tabs preserve usable navigation and revalidate current inventory/prices.
- [ ] Empty or expired bag cannot create a paid order; unavailable selections explain recovery.
- [ ] Verify accented/short names, optional phone/company/unit, ZIP+4 and supported destination/address types.
- [ ] Same/separate billing validation works; first error gets focus, corrected errors clear and announcements are understandable.
- [ ] Shipping, discounts, tax and final USD total match provider/order records before authorization.
- [ ] Approved payment methods succeed; decline/cancel/timeout/retry cases do not create false confirmations or duplicate charges/orders.
- [ ] Duplicate, delayed or invalid webhook notifications are handled safely; browser success alone cannot mark an order paid.
- [ ] Two shoppers attempting the last unit cannot both buy unavailable stock; abandoned reservations expire correctly.
- [ ] Paid order produces one correct email; shipment email uses actual tracking/handoff; cancellations and refunds produce accurate notifications.
- [ ] Pack and ship a sample order; verify tracking, delivery, return instructions, inspection and one correct refund with tax/stock reconciliation.
- [ ] Physical iOS/Android, keyboard-only use, supported screen readers and 200%/400% zoom pass the relevant purchase scenarios.
- [ ] Production HTTPS, security controls, error logging/redaction and recovery are verified.
- [ ] Owner signs off the evidence and performs the controlled live payment/refund through the provider's permitted process.

## High priority and optional work

- [ ] Production links/navigation and crawlable routes — [L18](https://github.com/sahilkaila21/keepitstylish/issues/18).
- [ ] Real-device/slow-connection performance and production measurements — [L19](https://github.com/sahilkaila21/keepitstylish/issues/19).
- [ ] Final domain, unique product URLs/metadata, sitemap/robots, valid product data and indexing — [L20](https://github.com/sahilkaila21/keepitstylish/issues/20).
- [ ] Approved analytics/conversion tracking with consent/privacy gates and transaction reconciliation — [L21](https://github.com/sahilkaila21/keepitstylish/issues/21).
- [ ] Permission-based newsletter, authentic reviews and retention campaigns — [L22](https://github.com/sahilkaila21/keepitstylish/issues/22), [L23](https://github.com/sahilkaila21/keepitstylish/issues/23).

## Work order

Verify seller/locations and products while choosing the platform → configure fulfillment/taxes/policies → integrate payments, stock and emails → rehearse orders/returns and security/accessibility → perform final controlled acceptance → open ordering → improve acquisition/retention using verified results.

See [verification](verification.md) for bounded test evidence, [launch inputs](launch-inputs.md) for the missing records and [release runbook](release-runbook.md) for preview deployment/recovery. Do not publish private customer or supplier evidence in this public repository.
