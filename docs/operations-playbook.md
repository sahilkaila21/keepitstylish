# Operations playbook — draft for rehearsal

Owner: Needs assignment. Effective date: Needs approval. This is an internal worksheet, not a customer policy. Do not accept payments until launch-inputs.md is completed and checkout is integrated and tested.

## Before the first order

- [ ] Confirm seller, ship-from and return locations (#1).
- [ ] Confirm platform, order source of truth and staff permissions (#2).
- [ ] Assign fulfillment, customer support, refund approval and incident owners; name a backup.
- [ ] Verify support mailbox access with an inbound and outbound test.
- [ ] Record approved destinations, carriers, handling cutoff, dispatch days and escalation contacts (#7).
- [ ] Confirm return eligibility/window, label payer, refund timing and damaged-item exceptions (#12).
- [ ] Measure packed weight/dimensions for one and two dresses; obtain actual rates.
- [ ] Rehearse one paid test order, shipment, cancellation and return using the selected platform's test tools (#17).

## Receiving and inventory

1. Match purchase order, supplier packing list and physical count by SKU/size.
2. Check each garment for stains, seams, closures, odor, damage, correct size and required labels. Photograph defects; quarantine failed pieces.
3. Measure a sample of each size against the approved specification. Escalate differences beyond the approved tolerance (Needs verification).
4. Record received, quarantined, sellable and reserved quantities separately. Enter only sellable stock in commerce inventory; never infer stock from this preview's S/M/L buttons.
5. Store by SKU in labeled bins. Reconcile discrepancies before releasing inventory.

## Paid order to dispatch

1. Verify payment status in the merchant platform, address, SKU, quantity and any fraud hold. An email or browser success screen alone is insufficient.
2. Reserve stock once. Do not fulfill duplicate webhook notifications or duplicate orders without checking identifiers.
3. Pick the SKU and size; second-check against the order. Repeat garment QC.
4. Fold, protect and package. Include the approved packing slip; exclude unnecessary personal information. Use the recorded packed dimensions/weight.
5. Buy the correct service, verify label and destination, and record tracking. Mark dispatched after actual handoff; retain acceptance evidence.
6. Confirm the tracking email was delivered. Escalate missing scans or delivery exceptions under the chosen carrier's process.

Record: order ID | SKU/qty | payment verified | QC | packer | parcel weight | tracking | handoff time | exception.

## Customer support

Coverage hours and first-response target: Needs decision. Use an internal target only until it can be consistently met.

- Locate orders by order ID and verified email. Never request full card numbers, passwords or identity documents through ordinary email.
- Fit question: use approved garment measurements; do not guess stretch, fit or fabric.
- Where is my order: check actual dispatch and tracking. Share the current status and next update time; avoid guarantees unsupported by the carrier.
- Address change: confirm the customer and fulfillment status before changing; if dispatched, follow carrier rules.
- Damaged/wrong item: request order ID, description and relevant product photos, then route to the approved replacement/refund process.
- Cancellation: check payment and fulfillment state; release reservation and refund via the original payment transaction when applicable.
- Escalate payment disputes, threats, repeated delivery failures and data incidents to the assigned owner.

## Return and refund

1. Check the policy version presented at purchase and record request date, reason, order ID and items.
2. Confirm eligibility and send the approved destination/instructions. Do not invent an address or promise free returns.
3. On receipt, log condition and inspection outcome; quarantine used/damaged items and restore inventory only after QC.
4. Calculate the refund from the original order, including discounts and applicable shipping/tax adjustments under the approved policy and platform configuration.
5. Authorized staff refund through the original provider, recording transaction ID, amount and date. Check for an existing refund first.
6. Send the actual refund confirmation; explain provider processing time using verified provider guidance.

## Daily close and incident handling

- Reconcile paid orders, captures, shipments, cancellations, refunds and inventory movements.
- Review failed notifications, oversells, pending payments and support backlog.
- If payments, totals or inventory become unreliable, pause checkout using the platform's supported control. Preserve order records and assign an incident owner.
- Record incident start, affected orders, customer impact, action and recovery evidence. Restrict personal data in issue trackers and logs.
- Run periodic restore/access reviews and keep recovery instructions with the selected platform configuration (#16).

## Rehearsal evidence

Date | operator | scenario | expected outcome | actual result | evidence location | follow-up issue.

Pass criteria: correct SKU reaches the sample recipient; tracking works; a return is received and inspected; exactly one correct refund is recorded; stock and accounting reconcile. All currently **Needs verification**.
