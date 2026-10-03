# Preview verification — October 2, 2026

Scope: static storefront on the launch-readiness branch, served locally at 127.0.0.1:4174. Changes require PR review/merge before affecting the public site. Payments remain disabled.

## Automated checks

`node --test tests/storefront.test.cjs`: 21 passing checks. Includes hostile/stale cart records, canonical prices, quantity bounds, blocked storage, data minimization, validation, local assets, parse checks for all storefront scripts, duplicate static IDs, labels, hash/navigation targets, image size budgets and search-route encoding/normalization.

These checks do not exercise a real payment provider, backend, external email delivery or every browser interaction. Static reference checks cover literal links; they are not a general external link crawler.

## Browser checks completed

- Emerald: select M, open size guide, follow return link: M remains selected.
- Enlarge gallery, next image, zoom in, Escape: dialog closes and focus returns to image trigger.
- Cart: add item, increment quantity in a second tab: first tab displays two items/$109.98. Remove in second tab: first tab shows empty bag.
- Quantity update retains focus on its button; removal focuses the bag heading.
- Empty checkout submission: eight invalid fields marked; first-name field receives focus.
- Mobile menu: Shift+Tab wraps to last link, Tab wraps to close button, Escape returns focus to Menu.
- No horizontal overflow in these observed CSS viewport/view pairs: 320px home/product/cart/checkout; 390px home; 768px product; 1024px product/home. Actual innerWidth was checked, not inferred from requested viewport.
- Visible product images loaded in the inspected home/product views.

During development, a cached older JS file caused quantity buttons to reference a missing new helper. Asset query versions were advanced; the two-tab quantity/removal flow then passed. Historical console entries from that failed iteration are not evidence of a current failure.

## Performance work and limits

- Hero now requests an appropriate 640/1280 source and high fetch priority.
- Google font connections are hinted; existing font display=swap remains.
- Product cards retain responsive sources and lazy loading; hero/gallery containers reserve their layout area.
- 1280px WebP files: 192,658 / 119,270 / 153,698 / 138,890 bytes, totaling 604,516 bytes (about 93% smaller than the four original 9,004,835-byte images).
- 640px files: 100,182 / 61,194 / 83,436 / 67,038 bytes. CI budgets are below 110 KB per small image and 210 KB per large image.

These are file-size measurements, not mobile speed or Core Web Vitals scores. The browser inspection surface did not expose Performance entries. Production LCP, INP, CLS, cold-cache mobile loading, font shifts and throttled network performance remain **Needs verification** after hosting is selected. Do not label this preview Lighthouse-tested.

## Still needs verification

- iOS Safari and Android Chrome on physical devices; 200% browser zoom and screen-reader review.
- Contrast across every image crop and UI state; no WCAG certification is claimed.
- Back/forward behavior across all pages and all production external links.
- Real garment photos, measurements, stock and product claims; current imagery is illustrative.
- Production server routes, indexing, redirects, headers, security, monitoring and email delivery.
- Backend stock reservation, simultaneous cart edits, final tax/shipping totals, payment failures, order idempotency and refund flows.

Business/platform-dependent acceptance remains in issues #1–#17 and #20–#23. Frontend changes and draft documents are ready for review; they do not satisfy those launch gates by themselves.

## Expanded high-priority checks

All 16 routes were checked at each of 320, 390, 768 and 1024 CSS pixels: **64 route/viewport checks, zero document-width overflow findings and zero broken completed visible images**. The actual browser width was captured for every check. Routes: home, collections, both product IDs, cart, checkout, contact, shipping, returns, size-guide, track-order, privacy, terms, account, about and custom. Cart/checkout used a preview item. This checks geometry and loaded images, not every interaction or screen-reader announcement at every width.

Search “coral”, choose descending sort, reload: one matching dress and the selected sort persist in the URL/UI. Product navigation then Back restores the search. A no-match query shows an empty result with Clear search; Back/Forward restores it; clearing restores both products. No browser console errors were recorded in this verification run.

Navigation now dismisses open search/gallery dialogs, avoids duplicate hash/popstate restoration, and refocuses the populated product heading. Product main images use responsive sources; thumbnails use smaller variants. The dark About-page eyebrow has a light text override. Physical-device, zoom, full contrast and assistive-technology checks remain open.

## Checkout accessibility follow-up

- Submitting a product without a size announces an alert and focuses the first selectable size; no item is added.
- Direct empty-bag checkout navigation returns to the empty cart. Payment validation cannot run against an empty bag.
- Using synthetic local test values, Continue to Payment focuses the Payment heading; the payment button remains disabled. Edit returns focus to the first shipping field. Reload clears test form values; they were not submitted or saved.
- Two regression tests cover missing-size focus/unchanged bag and the empty-bag payment guard. No browser errors were recorded in this follow-up.

## Local diagnostics harness

Open `/tests/preview-diagnostics.html` on localhost. Choose the width, reload the embedded preview, then capture observations after it settles. This opt-in development page is not loaded by the storefront and does not transmit results. Outside localhost its controls are disabled.

The harness reads browser navigation/paint entries, observes buffered LCP and layout-shift entries, and checks basic visible control names, image alt attributes, broken loaded images and document overflow. These checks are intentionally limited; they do not replace an accessibility audit. Unsupported measurements are null. The frame's actual dimensions are included in the report.

One cached, unthrottled local run at 390×844 recorded DOMContentLoaded 78ms, load 86ms, first contentful paint 112ms, observed LCP 112ms and observed CLS 0.0004. No findings appeared in that run's basic name/image/overflow checks. These are partial embedded-frame observations affected by cache, desktop CPU and frame visibility. They are **not** a standalone mobile page score, final Core Web Vitals values or evidence that the production performance gate passes. INP was not measured. The earlier direct inspection limitation is now partly addressed by this opt-in harness; production/physical-device measurements remain open.

## Boutique visual refinement

The homepage now uses a centered two-column collection, one hero shopping link and product-specific editorial copy. Removed the moving text strip, New badges and bag emoji; increased body weight and key text sizes. Product heading/price come before the gallery in DOM order, with a shorter mobile gallery and a two-column desktop layout. About copy is condensed to the current collection; founder verification inputs are recorded separately.

After this change, 21 automated checks still pass. Twelve layout checks passed with no document-width overflow: home, collections, product and about at 320, 768 and 1440px. Coral was inspected at desktop and Emerald at mobile/tablet; Emerald also received a separate 390px visual check. Desktop home cards measured 540px each and formed a centered pair. Mobile title/price appeared before the image. Selecting M, visiting the size guide and returning retained M. No console errors were recorded in the design verification run. Real garment and founder photographs remain required to substantiate authenticity.
