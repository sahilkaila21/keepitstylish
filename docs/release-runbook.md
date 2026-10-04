# Storefront release and recovery

## Which project is live

The public preview is the `main` branch of `sahilkaila21/keepitstylish`, served at https://sahilkaila21.github.io/keepitstylish/. Edit this repository's `index.html` and `assets` files. The outer workspace also contains older HTML copies and a separate Next.js prototype; changes to those do not update this site.

The preview accepts no payments. It is not the production order database. Frontend rollback cannot cancel payments or restore inventory on a future commerce platform.

## Before publishing

1. Record the current successful Pages deployment and commit as the recovery point. Keep unrelated local changes out of the release.
2. Run `node --test tests/storefront.test.cjs tests/release-safety.test.cjs`, then `node tests/release-safety.cjs` after staging intended files. Run `git diff --check` and review the changed files.
3. For visual/interaction changes, check affected pages at narrow phone width, phone landscape and desktop. Check keyboard focus, empty/error states and the product gallery. Record scope and limitations in verification.md.
4. Keep ordering disabled until all actual business, inventory, policies, provider and end-to-end acceptance gates pass. No preview price or size button proves physical availability.
5. Review a pull request and successful checks against its current head commit. Merge that reviewed commit, then wait for Pages to deploy the merge commit successfully.
6. Reload the published page. Verify the new asset version, affected UI, images, navigation and browser errors. For payment-enabled production releases, use the platform-specific acceptance process instead of this preview-only checklist.

## Recovering a faulty preview release

1. Record affected URLs, last working deployment, failing commit and symptoms. Do not put customer data or credentials in GitHub.
2. Revert the faulty change in a new branch/PR, preserving later valid changes. If reverting a merge commit, first verify its parents and mainline; do not guess the parent or force-push `main`.
3. Run the same checks and publish the revert. Wait for its successful Pages deployment, then verify the public site and original failure scenario.
4. Keep the incident and follow-up issue open until recovery is verified. On a future live commerce system, also reconcile orders/payments and communicate with affected customers through the approved support process.

## Scope of the safety scan

The scan blocks tracked environment/key files, selected local artifacts and common private-key/Stripe/GitHub token patterns. It reports filenames/categories only. It does not detect every secret, personal-data record or unsafe dependency; it does not replace repository secret protection, credential rotation, access review or a production security audit. Ignore rules do not remove already tracked files. CI checks provide evidence but are not a configured deployment gate or branch-protection rule.

