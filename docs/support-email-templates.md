# Customer email and support drafts

Preparation only; nothing is connected or sent. Replace every bracketed field from verified order records. Confirm the sender mailbox, policy wording and platform event mapping before enabling these templates. Use the original payment provider for refunds. Keep customer records out of GitHub.

## 1. Product or sizing question

Subject: Your question about [dress name]

Hi [first name],

Thanks for asking about [dress name]. [Answer using approved measurements, material or product information. If the detail is unknown, say it is being checked and give an actual follow-up date.]

You can see the dress here: [product link]. Please reply if there’s another detail you’d like us to check.

[support signature]

## 2. Paid order confirmation

Trigger: one verified paid order; deduplicate by order ID. A checkout visit is not a paid-order event.

Subject: Order [order number] — thank you from Keep It Stylish

Hi [first name],

We’ve received payment for your order.

- [item name, color, size, quantity and line total]
- Merchandise: [amount USD]
- Discount: [amount USD]
- Shipping: [amount USD]
- Sales tax: [amount USD]
- Total paid: [amount USD]
- Delivery address: [verified shipping address]
- Shipping service and current estimate: [approved service / estimate]

We’ll send tracking after your parcel is dispatched. You can review your order at [secure order link]. For help, reply with your order number. Please don’t send card details.

[support signature]

## 3. Shipment confirmation

Trigger: actual dispatch with a valid carrier/tracking record.

Subject: Your order [order number] has shipped

Hi [first name],

Your parcel was dispatched on [date] with [carrier/service].

Tracking: [carrier tracking link]
Current delivery estimate: [carrier-supported estimate]
Items in this parcel: [items/quantities]
[If split shipment: list outstanding items and their actual status.]

Reply with your order number if you need help.

[support signature]

## 4. Shipping delay

Trigger: a verified delay; check the applicable shipping rule, consent/cancellation process and approved policy before sending. Do not substitute this draft for the required process.

Subject: An update on order [order number]

Hi [first name],

[Explain the actual delay briefly.] Your order’s current status is [status]. [Give a supported revised ship date, or explain that a reliable date is not available.]

[Insert the approved options for waiting, consent, cancellation and refund, with the actual customer action link and relevant deadline.]

We’ll update you again on [actual follow-up date]. Reply with your order number if you need assistance.

[support signature]

## 5. Cancellation confirmation

Trigger: cancellation is recorded and fulfillment is stopped; verify payment/refund state separately.

Subject: Order [order number] has been cancelled

Hi [first name],

Your order was cancelled on [date]. [State the actual payment status: no charge / authorization released / refund initiated.]

[If refunded: amount, original payment method described without full card details, verified processing guidance and secure order link.]

[support signature]

## 6. Return instructions

Trigger: staff have checked eligibility against the purchase policy and approved the return destination.

Subject: Return instructions for order [order number]

Hi [first name],

Your return request for [items] has been approved under [policy link/version].

Return reference: [reference]
Return destination: [verified address]
Instructions: [packaging, label and carrier instructions]
Postage responsibility: [approved policy]
Relevant deadline: [approved date]

[Describe the actual inspection/refund or exchange process without promising an unapproved outcome.]

[support signature]

## 7. Refund confirmation

Trigger: the payment provider confirms the refund; deduplicate by refund ID. Do not say completed if only a request was submitted.

Subject: Refund update for order [order number]

Hi [first name],

A refund of [amount USD] was [actual provider status] on [date] to your original payment method.

Refunded items/charges: [approved breakdown including relevant discounts/tax/shipping]
[Insert the provider’s verified processing guidance.]
Order details: [secure order link]

[support signature]

## 8. Wrong, damaged or missing item

Subject: We’re checking order [order number]

Hi [first name],

Thanks for letting us know about [issue]. Please reply with [the minimum necessary item details and relevant product/package photos]. Please don’t send card numbers, passwords or identity documents.

We’ll check the order and contact you by [actual follow-up date] with the available resolution under [approved policy].

[support signature]

## Acceptance before activation

- Verify actual sender/reply inboxes and domain authentication.
- Test each event with synthetic orders and controlled recipient inboxes.
- Confirm correct item variants, USD amounts, links, address formatting and accessibility.
- Retry events without sending duplicates; handle failed delivery and support follow-up.
- Keep marketing subscriptions and promotions separate from these operational messages.
- Do not log message bodies or customer addresses in public issue trackers.
