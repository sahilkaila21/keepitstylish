# Catalog maintenance

Edit `assets/catalog.js` for product names, prices, sizes, colors, descriptions, gallery filenames and image descriptions. It is loaded before the application; cards, product detail, bag restoration and browser descriptions use the same catalog.

Keep product IDs stable so shared links and saved bags remain usable. Add matching 640px/1280px WebP files for every image and one descriptive alt entry per gallery image. Verify real product facts before changing availability or adding manufacturing/material claims. Never add credentials or customer data here: all storefront files are public.

Run `node --test tests/storefront.test.cjs` after a change. CI checks unique IDs, positive prices, duplicate sizes, matching image descriptions, asset references, smaller responsive variants and file budgets, plus navigation/cart behavior.

When adding a product, update product verification records, intended SEO paths and descriptive homepage/About/footer copy. Those editorial passages are reviewed separately from the catalog.

## Preview SEO

The published preview has a homepage description and Open Graph tags pointing to the verified GitHub Pages URL. Product browser descriptions use catalog copy. Many sharing/indexing crawlers do not execute hash navigation; these tags do not create independently crawlable product pages or product-specific social cards. Complete the separate URL, canonical, sitemap, robots, structured data and Search Console work on the chosen production platform, as recorded in seo-release-plan.md. No purchasable offers or invented ratings are published.
