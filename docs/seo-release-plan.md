# Production SEO release plan

Issue #20. Current hash routes are preview navigation; the following are proposed routes to implement on the chosen commerce platform, subject to its URL rules.

| Preview route | Proposed production path | Content owner |
|---|---|---|
| #home | / | Brand |
| #collections | /collections/dresses | Catalog |
| #emerald-ruffle-midi | /products/emerald-ruffle-midi | Catalog |
| #coral-floral-ruffle-midi | /products/coral-floral-ruffle-midi | Catalog |
| #blue-floral-ruffle-collar-midi | /products/blue-floral-ruffle-collar-midi | Catalog |
| #size-guide | /pages/size-guide | Product measurements |
| #shipping | /policies/shipping | Operations |
| #returns | /policies/returns | Operations |
| #privacy | /policies/privacy | Privacy reviewer |
| #terms | /policies/terms | Legal reviewer |
| #contact | /pages/contact | Support |

## Implementation order

1. Confirm production domain and canonical host. Prepare a separate preview/staging environment with access/indexing controls.
2. Serve each product's primary content and unique title/description on its own URL. Use the drafts in marketing-drafts.md only after product verification. Do not require a crawler to navigate hash fragments to discover the dresses.
3. Set absolute canonical URLs to the approved host. Avoid indexing cart, checkout, account and internal search pages; choose the platform's supported controls.
4. Add social title/description/image and verify crops using approved imagery. Existing AI images must not substitute for actual garment evidence.
5. Generate Product/Offer data from the same approved catalog used by checkout: name, real image URLs, SKU, USD price, actual availability and canonical product URL. Do not add ratings or reviews that do not exist. Do not publish purchasable offers while ordering is disabled.
6. Generate sitemap entries only for canonical public pages; verify robots rules do not block launch pages. Robots exclusions alone do not protect private staging content.
7. Preserve old links with platform redirects where possible. URL fragments are not sent to servers, so existing hash bookmarks need a small client-side migration mapping on the old storefront if that host remains accessible. Do not pretend a server can read a fragment.
8. Verify domain ownership in Search Console, submit the sitemap, inspect all three product URLs and record actual indexing results. Search indexing is not guaranteed by submitting a sitemap.

## Release checks

- [ ] Production host, HTTPS and redirect chain verified.
- [ ] Each product URL returns its own content, correct status and approved metadata.
- [ ] Nonexistent product path returns a genuine 404; unavailable stock does not produce a misleading offer.
- [ ] Canonical host, sitemap and social URLs agree; staging URLs absent.
- [ ] Product data matches visible price, SKU, stock and images; validator results reviewed.
- [ ] Shared links show the intended dress/title/image.
- [ ] Search results and checkout do not leak customer data into indexed URLs or analytics.
- [ ] All three product pages inspected in Search Console after publishing.

Domain/provider settings and production checks are Needs verification. No robots.txt, sitemap, canonical host or structured offers are fabricated for this static preview.
