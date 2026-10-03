# Pricing and order economics worksheet

Internal planning only. Current preview price is $54.99 per dress; approval and costs remain Needs verification. Complete separately for all three dresses and for one- and two-item parcels.

| Input | Symbol | Value/source |
|---|---|---|
| List price per unit | P | 54.99 preview value |
| Discount fraction | d | Needs decision |
| Units in order | q | Scenario: 1 or 2 |
| Landed garment cost per unit (including inbound freight/duties) | C | Needs verification |
| Packaging per order | K | Needs verification |
| Pick/pack labor per order | L | Needs verification |
| Outbound carrier cost | S | Actual quote needed |
| Shipping collected from customer | H | Needs decision |
| Payment fee fraction and fixed fee | f, F | Provider quote needed |
| Tax collected | T | Tax configuration needed |
| Expected returns/defects loss per order | R | Scenario estimate, then actual data |
| Customer acquisition cost per order | A | Scenario budget |
| Other variable platform fees | V | Needs verification |

## Calculations

- Merchandise revenue M = round(P × q × (1 − d), 2).
- Customer payment = M + H + T.
- Estimated payment fees = f × (M + H + T) + F; verify the provider's actual fee base, refund and cross-border charges.
- Contribution before acquisition = M + H − qC − K − L − S − payment fees − R − V.
- Contribution after acquisition = contribution before acquisition − A.
- Maximum acquisition cost at zero contribution = contribution before acquisition. Set an actual budget below this to cover overhead and profit.
- Return allowance R should include expected unrecovered shipping, handling, garment loss and nonrefunded fees; avoid counting the same cost twice.

Sales tax collected is excluded from revenue in this planning model. Confirm actual accounting and tax treatment with your adviser. Fixed overhead is not included in contribution.

## Worked revenue-only example

One $54.99 dress at a hypothetical 15% discount produces $46.74 merchandise revenue. This is not a approved promotion or a profit estimate. Costs, shipping and tax remain unknown.

| Scenario | Merchandise revenue | Contribution after acquisition | Approved? |
|---|---:|---|---|
| One dress, no discount | $54.99 | Needs costs | No |
| One dress, hypothetical 15% discount | $46.74 | Needs costs | No |
| Two dresses, no discount | $109.98 | Needs costs | No |
| Return or damaged shipment | Depends on actual refund | Model unrecovered costs | No |

Before launching: approve base price, discount floor, shipping subsidy limit, refund reserve and acquisition budget. Remove or replace preview coupon codes WELCOME10, SAVE2 and FESTIVE15 in production unless explicitly approved and validated server-side.
