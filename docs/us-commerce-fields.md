# U.S. storefront and checkout field specification

This records the implemented preview fields and remaining production requirements. “Standard” here means a practical conventional shopping flow, not a claim that every field is legally mandatory. Mandatory collection should be limited to what the actual payment, fulfillment and business process requires.

## Implemented in the preview

| Area | Fields/behavior |
|---|---|
| Currency | USD product and order values; dollar display; explicit USD notice |
| Guest contact | Required first/last name and email; optional U.S. phone, with format validation if supplied |
| Shipping | Optional company; United States country; street/PO Box; optional apartment/suite/unit/building; city; 50 states and DC; ZIP or ZIP+4 |
| Autofill | Named shipping and billing groups; separate address-line1/address-line2; appropriate name/email/phone/city/state/postal tokens |
| Billing | Same as shipping by default; separate full name, country, street, unit, city, region and postal fields when unchecked |
| Billing validation | Required name/country/street/city; U.S. state name or valid abbreviation and ZIP/ZIP+4 required for U.S. billing; region/postal formats flexible for other countries |
| Order review | Product, size/color, quantity, USD unit/line amounts, discount, shipping pending, explicit estimated-tax row, merchandise estimate |
| Recovery | Edit shipping; keep fields while reviewing in the same page session; focus first error; separate billing hidden when unused |
| Policy access | Shipping, returns, privacy and terms linked near checkout; pre-launch policy status disclosed |

Apartment information is a separate optional field because some delivery addresses require a secondary unit on the label. Preserve it through orders and fulfillment; do not discard it during standardization. [USPS secondary address guidance](https://pe.usps.com/text/pub28/pub28c2_003.htm).

The preview checks format only; it does not verify deliverability, state/ZIP consistency, country names or billing identity. The free-text billing country must be mapped to the provider's supported country selector/ISO codes in production. Carrier service to PO Boxes, Alaska/Hawaii, territories and military addresses remains unconfirmed. Preview fields do not grant service availability.

## Production checkout requirements — issues #7–#10, #12–#13

- Address verification that lets customers review corrections and preserves valid unit numbers and names.
- Country/region and delivery-zone rules matched to actual supported destinations. Add territory and Armed Forces options only with tested fulfillment support.
- Shipping service name, rate and supported delivery/handling estimate; show additional duties where applicable under the approved import arrangement.
- Server-calculated merchandise, discount, shipping, applicable tax and final order total before payment. Unknown charges must not be represented as zero. Validate promotions on the server.
- Hosted payment UI from the selected provider; card and wallet options based on merchant eligibility. Verify supported credit/debit cards and desired Apple Pay/Google Pay/PayPal options rather than showing unsupported logos.
- Billing information and authentication collected through provider-supported components. Raw card number, security code and payment credentials must not pass through this static preview.
- Failed, canceled, pending and duplicate payment handling; verified durable order, inventory reservation and refund reconciliation.
- Order number, status, payment amount, item/variant list, shipping address, method, contact/support and confirmation email. Verified shipment/tracking and refund emails.
- Optional marketing signup only when real consent/preference storage and unsubscribe exist. Keep it distinct from placing an order; do not preselect optional marketing consent.
- Verify final policies, customer disclosures, sales-tax configuration and applicable privacy controls with qualified reviewers.

Shipping promises need a factual operational basis. The FTC's order-merchandise rule addresses shipment timing and delay/refund obligations; review the actual fulfillment process with a qualified professional. [FTC business guide](https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule).

## Product fields to complete — issues #3–#5

Each dress needs approved title, product ID, SKU per size/color, actual price, sellable stock, variant availability, real photographs, materials/fiber percentages, lining, construction/closure, stretch/opacity, care, manufacturing origin and actual garment measurements. Fit/model details require evidence. Use inches with optional cm conversion; distinguish body from garment measurements. Show shipping/returns links and accurate availability without fabricated ratings or scarcity.

The existing product workbook contains the proposed six SKU records and verification inputs. These product facts cannot be filled from U.S. market conventions alone.

## Acceptance evidence for this change

21 automated tests pass, including optional phone/ZIP+4, hidden billing validation, U.S. billing state/ZIP validation and flexible non-U.S. region formats. Browser checks passed for shipping with blank phone and Apt 4B, same-as-shipping review, separate billing required-field focus, a NY billing address review, clearing hidden billing errors, and 320px layout without overflow. Synthetic values were used locally and cleared on reload. Payments remain disabled; no order was placed.
