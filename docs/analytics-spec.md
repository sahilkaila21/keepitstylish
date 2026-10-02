# Commerce analytics implementation specification

Issue #21 — ready for platform implementation. No analytics provider, tracking script, cookies or event transmission is enabled by this document.

## Event contract

All currency values are USD. Monetary values are decimal dollars rounded from integer cents. Event names below are an internal contract; map them to the chosen provider's documented schema during integration.

| Event | Trigger | Allowed fields | Prevent duplicates |
|---|---|---|---|
| view_item | A product detail route becomes active | product_id, variant_id if selected, currency, unit_price | Once per completed route transition; not on image/size changes |
| add_to_cart | Valid quantity successfully added | product_id, variant_id, quantity_added, currency, unit_price | Once per successful action; not on restore or another tab's update |
| remove_from_cart | Valid quantity removed | product_id, variant_id, quantity_removed, currency, unit_price | Once per successful action |
| begin_checkout | Nonempty bag enters checkout | item list, currency, merchandise_value | Once per checkout attempt; not on field validation errors |
| purchase | Backend verifies successful payment and durable order | opaque transaction_id, item list, currency, merchandise_value, tax, shipping, discount | Unique transaction_id; provider retries cannot create a second conversion |
| refund | Provider confirms successful refund | opaque transaction_id, opaque refund_id, refunded items, currency, refund amount | Unique refund_id; partial refunds remain distinct |

Variant IDs must come from the approved SKU catalog. Browser-submitted prices are not authoritative for purchases/refunds. Analytics failures must never prevent payment, order creation or refunds.

## Data minimization

Allowlist the fields above. Do not spread form objects, order objects, page URLs or arbitrary DOM text into events. Exclude names, email, phone, addresses, card information, customer messages and raw search terms. Search terms can contain personal information, so this preview's `q` parameter must be stripped from automatic pageview reporting.

Report a normalized route name/product ID instead of a full URL. Allow only approved campaign parameters and values; reject arbitrary query strings. Use opaque transaction identifiers; do not encode an email or customer name in them. Keep preview/staging events out of production reporting.

## Privacy configuration gate

Before connecting a provider, document vendor, purpose, data flow, retention, access owner, applicable choices and deletion process with the privacy reviewer (#12). Define required behavior before and after each applicable choice. Test withdrawal and browser privacy signals where applicable. No legal applicability is assumed here.

Keep analytics delivery disabled until this gate is approved. If optional collection is disabled, avoid both network requests and a persistent backlog of events waiting to be replayed. Operational payment records and optional marketing analytics need separate handling.

## Acceptance cases

1. Product route change yields one view; Back/Forward yields one per actual return; initial load does not double-report from two history listeners.
2. Quantity +1 reports one unit, not the final bag quantity. Quantity reduction/removal reports the actual removed units.
3. Restore, storage sync, invalid size and capped quantity generate no add event.
4. Empty bag and invalid checkout submission create no purchase event.
5. Payment failure/cancellation/pending produces no purchase conversion. Confirmed delayed payment produces one after verification.
6. Duplicate/reordered payment notifications and confirmation-page refresh produce one purchase total.
7. Two partial refunds report two refund IDs; retrying either reports no duplicate.
8. Discounts, tax and shipping reconcile to the authoritative order to the cent. Document whether dashboard revenue includes/excludes tax/shipping.
9. Privacy choices produce the approved network/storage behavior; withdrawal stops future optional delivery.
10. Inspect actual requests for personal information; try a search containing an email and confirm neither URL nor query is transmitted.
11. Block the analytics endpoint: browsing and checkout still work. Distinguish provider delivery failures from failed purchases.
12. Reconcile a test day's analytics purchases/refunds against order records; explain consent/ad-blocking exclusions before judging the data.

Evidence template: environment | scenario | transaction/refund ID (test only) | expected event/count/value | observed request | dashboard result | pass/fail | reviewer.

## Dependencies

Implement browser events after platform routing/cart hooks are settled (#2/#18). Implement authoritative purchase/refund events after #9/#10. Provider configuration and privacy approval are required before activating delivery. Dashboard attribution accuracy remains Needs verification; this specification alone does not complete #21.
